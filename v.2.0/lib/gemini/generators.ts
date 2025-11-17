/**
 * Генераторы изображений с использованием Gemini API
 */

import { getImageModel, GEMINI_CONFIG } from './config'
import { prepareImageForGemini } from './image-processing'

interface GenerateOptions {
  personImage: Buffer
  clothingDescription?: string
  clothingImage?: Buffer
  backgroundDescription?: string
  cameraAngle?: string
}

/**
 * Генерация изображения с примеркой одежды
 */
export async function generateTryOnImage(options: GenerateOptions): Promise<Buffer> {
  const model = getImageModel()
  
  // Подготовка изображения человека
  const personImageData = await prepareImageForGemini(options.personImage)
  
  // Формирование промпта
  let prompt = ''
  const parts: any[] = []
  
  // Добавляем изображение человека
  parts.push({
    inlineData: {
      mimeType: personImageData.mimeType,
      data: personImageData.data,
    },
  })
  
  // Если меняем фон
  if (options.backgroundDescription) {
    const cameraInstruction = options.cameraAngle
      ? `\n\nCRITICAL CAMERA ANGLE REQUIREMENT:\n- You MUST change the camera angle/perspective to: ${options.cameraAngle}\n- This is a mandatory requirement, not optional\n- The camera angle change must be clearly visible and noticeable`
      : `\n\nCAMERA ANGLE REQUIREMENT:\n- You MUST change the camera angle/perspective to better match the new background environment\n- The camera angle should be different from the original photo`

    prompt = `You are an expert AI background replacement assistant.

Task: Change the background AND camera angle/perspective of this image.

CRITICAL RULES - STRICTLY FOLLOW:
- DO NOT change the person's appearance, face, body, or clothing AT ALL
- DO NOT modify the person's pose, position, or proportions
- DO NOT alter any clothing, accessories, or items the person is wearing
- CHANGE the background to: ${options.backgroundDescription}
${cameraInstruction}
- The camera angle change should be noticeable and appropriate for the new background
- Maintain realistic lighting that matches the new background
- Ensure the person looks natural in the new environment
- Keep all shadows and reflections consistent with the new background
- Adjust the viewing angle so it looks like the photo was taken from a different perspective in the new location

Generate a photorealistic image with the new background and DIFFERENT camera angle while keeping the person completely unchanged.`
  }
  // Если есть изображение одежды
  else if (options.clothingImage) {
    const clothingImageData = await prepareImageForGemini(options.clothingImage)
    
    parts.push({
      inlineData: {
        mimeType: clothingImageData.mimeType,
        data: clothingImageData.data,
      },
    })
    
    prompt = `You are an expert AI virtual fitting room assistant.

Task: Transform this person's image to show them wearing the clothing from the provided image.

Requirements:
- Keep the person's face, body shape, pose, and proportions EXACTLY the same
- Transfer the clothing from the clothing image to the person naturally
- Maintain realistic lighting, shadows, and fabric physics
- Keep the original background
- Ensure the clothing looks professional and realistic
- Match the style and colors from the clothing image

Generate a photorealistic image showing the person wearing the clothing.`
  }
  // Если только текстовое описание одежды
  else if (options.clothingDescription) {
    prompt = `You are an expert AI virtual fitting room assistant.

Task: Transform this person's image to show them wearing: ${options.clothingDescription}

Requirements:
- Keep the person's face, body shape, pose, and proportions EXACTLY the same
- Add the described clothing naturally fitting their body
- Maintain realistic lighting, shadows, and fabric physics
- Keep the original background
- Ensure the clothing looks professional and realistic
- Match the style and colors from the description

Generate a photorealistic image showing the person wearing the described clothing.`
  }
  
  parts.push(prompt)
  
  // Отправка запроса в Gemini с retry логикой
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < GEMINI_CONFIG.maxRetries; attempt++) {
    try {
      console.log(`🔄 Отправка запроса в Gemini API (попытка ${attempt + 1}/${GEMINI_CONFIG.maxRetries})...`)
      
      const result = await model.generateContent(parts)
      const response = result.response
      
      // Извлечение изображения из ответа
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0]
        
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            // @ts-ignore - проверяем наличие inlineData
            if (part.inlineData && part.inlineData.data) {
              // @ts-ignore
              const imageData = part.inlineData.data
              const buffer = Buffer.from(imageData, 'base64')
              
              console.log('✅ Изображение получено от Gemini')
              return buffer
            }
          }
        }
      }
      
      // Если изображение не найдено, проверяем текстовый ответ
      const text = response.text()
      if (text) {
        console.warn(`⚠️ Gemini вернул текст вместо изображения: ${text.slice(0, 200)}`)
        throw new Error(`Gemini вернул текст вместо изображения: ${text.slice(0, 200)}`)
      }
      
      throw new Error('Gemini не вернул изображение')
      
    } catch (error: any) {
      lastError = error
      
      // Проверяем на rate limit
      const errorStr = error.message?.toLowerCase() || ''
      if (errorStr.includes('quota') || errorStr.includes('429') || errorStr.includes('rate limit')) {
        if (attempt < GEMINI_CONFIG.maxRetries - 1) {
          const delay = GEMINI_CONFIG.baseRetryDelay * 1000
          console.warn(`⚠️ Rate limit. Повтор через ${GEMINI_CONFIG.baseRetryDelay}s...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      // Для других ошибок не ретраим
      throw error
    }
  }
  
  throw lastError || new Error('Не удалось сгенерировать изображение после нескольких попыток')
}

/**
 * Извлечение изображения одежды из скриншота через AI
 */
export async function extractClothingFromScreenshot(screenshotBuffer: Buffer): Promise<Buffer> {
  const model = getImageModel()
  
  const imageData = await prepareImageForGemini(screenshotBuffer)
  
  const prompt = `You are an expert at analyzing product pages and extracting clothing images.

Task: Analyze this screenshot of a product page and extract the main product image showing clothing (shirt, dress, pants, jacket, etc.).

CRITICAL REQUIREMENTS:
1. Find the MAIN product image showing the clothing item clearly
2. The image should show the clothing item itself, not just a model wearing it (though model images are acceptable if they clearly show the clothing)
3. Crop out everything except the clothing product image
4. Remove all UI elements, text, buttons, navigation, and other page elements
5. Keep only the clean product image
6. If multiple product images exist, extract the first/main one
7. The output should be a clean, cropped image of just the clothing item

Generate a clean, cropped image of the clothing product from this screenshot.`
  
  const parts = [
    {
      inlineData: {
        mimeType: imageData.mimeType,
        data: imageData.data,
      },
    },
    prompt,
  ]
  
  try {
    const result = await model.generateContent(parts)
    const response = result.response
    
    // Извлечение изображения
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0]
      
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          // @ts-ignore
          if (part.inlineData && part.inlineData.data) {
            // @ts-ignore
            const imageData = part.inlineData.data
            const buffer = Buffer.from(imageData, 'base64')
            
            console.log('✅ Изображение одежды извлечено из скриншота')
            return buffer
          }
        }
      }
    }
    
    // Если не удалось извлечь, возвращаем оригинал
    console.warn('⚠️ Не удалось извлечь одежду, используем оригинальный скриншот')
    return screenshotBuffer
    
  } catch (error: any) {
    console.error('❌ Ошибка извлечения одежды из скриншота:', error.message)
    // В случае ошибки возвращаем оригинал
    return screenshotBuffer
  }
}

