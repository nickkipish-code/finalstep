/**
 * URL to Image endpoint
 * Генерация примерки по ссылке на товар
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateTryOnImage } from '@/lib/gemini/generators'
import { extractProductImages } from '@/lib/utils/scraper'
import { extractClothingFromScreenshot } from '@/lib/gemini/generators'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Получаем данные из формы
    const personImageFile = formData.get('person_image') as File
    const productUrl = formData.get('product_url') as string
    const description = formData.get('description') as string | null
    
    if (!personImageFile) {
      return NextResponse.json(
        { error: 'Не предоставлено изображение человека' },
        { status: 400 }
      )
    }
    
    if (!productUrl) {
      return NextResponse.json(
        { error: 'Не предоставлена ссылка на товар' },
        { status: 400 }
      )
    }
    
    // Валидация URL
    try {
      new URL(productUrl)
    } catch {
      return NextResponse.json(
        { error: 'Некорректная ссылка. Ссылка должна начинаться с http:// или https://' },
        { status: 400 }
      )
    }
    
    console.log('='.repeat(50))
    console.log('🚀 Начало обработки запроса /api/try-on/url')
    console.log(`📸 Получено изображение человека: ${personImageFile.name}`)
    console.log(`🔗 Ссылка на товар: ${productUrl}`)
    if (description) {
      console.log(`📝 Дополнительное описание: ${description}`)
    }
    
    // Конвертация File в Buffer
    const personImageBuffer = Buffer.from(await personImageFile.arrayBuffer())
    
    // Извлекаем изображения товара из ссылки
    console.log('🔍 Начинаем извлечение изображений товара...')
    let productImages: Buffer[]
    
    try {
      productImages = await extractProductImages(productUrl)
    } catch (error: any) {
      console.error('❌ Ошибка извлечения изображений:', error.message)
      return NextResponse.json(
        { error: `Не удалось извлечь изображения товара: ${error.message}` },
        { status: 400 }
      )
    }
    
    if (!productImages || productImages.length === 0) {
      return NextResponse.json(
        { error: 'Не удалось найти изображения товара на странице. Убедитесь, что ссылка ведет на страницу товара с фотографиями.' },
        { status: 400 }
      )
    }
    
    console.log(`✅ Найдено ${productImages.length} изображений товара`)
    
    // Используем первое изображение (или лучшее)
    let clothingImage = productImages[0]
    
    // Если это скриншот (очень большое изображение), пытаемся извлечь одежду через AI
    const firstImageSize = clothingImage.length
    if (firstImageSize > 1024 * 500) { // > 500KB (вероятно, скриншот)
      console.log('📸 Обнаружен скриншот, пытаемся извлечь одежду через AI...')
      try {
        clothingImage = await extractClothingFromScreenshot(clothingImage)
      } catch (error: any) {
        console.warn('⚠️ Не удалось извлечь одежду из скриншота, используем оригинал')
      }
    }
    
    console.log(`👔 Используем изображение товара (${clothingImage.length} bytes)`)
    
    // Формирование описания
    const clothingDescription = description || 'the clothing from the product page'
    console.log(`📝 Описание для генерации: ${clothingDescription}`)
    
    // Генерация результата
    console.log('🎨 Начинаем генерацию изображения с помощью Gemini...')
    const resultBuffer = await generateTryOnImage({
      personImage: personImageBuffer,
      clothingImage: clothingImage,
      clothingDescription: clothingDescription,
    })
    
    console.log('✅ Генерация завершена')
    console.log('='.repeat(50))
    
    // Возвращаем изображение
    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename=result.png',
      },
    })
  } catch (error: any) {
    console.error('❌ Ошибка обработки запроса:', error)
    console.log('='.repeat(50))
    
    // Обработка специфичных ошибок
    if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: `Превышена квота Gemini API. Попробуйте позже. ${error.message}` },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Ошибка генерации изображения' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 90 // Больше времени для парсинга и генерации

