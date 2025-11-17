/**
 * Image to Image endpoint
 * Генерация примерки по фото одежды
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateTryOnImage } from '@/lib/gemini/generators'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Получаем данные из формы
    const personImageFile = formData.get('person_image') as File
    const clothingImageFile = formData.get('clothing_image') as File
    const description = formData.get('description') as string | null
    
    if (!personImageFile) {
      return NextResponse.json(
        { error: 'Не предоставлено изображение человека' },
        { status: 400 }
      )
    }
    
    if (!clothingImageFile) {
      return NextResponse.json(
        { error: 'Не предоставлено изображение одежды' },
        { status: 400 }
      )
    }
    
    console.log(`📸 Получено изображение человека: ${personImageFile.name}`)
    console.log(`👔 Получено изображение одежды: ${clothingImageFile.name}`)
    if (description) {
      console.log(`📝 Дополнительное описание: ${description}`)
    }
    
    // Конвертация File в Buffer
    const personImageBuffer = Buffer.from(await personImageFile.arrayBuffer())
    const clothingImageBuffer = Buffer.from(await clothingImageFile.arrayBuffer())
    
    // Генерация результата
    const resultBuffer = await generateTryOnImage({
      personImage: personImageBuffer,
      clothingImage: clothingImageBuffer,
      clothingDescription: description || 'the clothing from the provided image',
    })
    
    // Возвращаем изображение
    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename=result.png',
      },
    })
  } catch (error: any) {
    console.error('❌ Ошибка обработки запроса:', error)
    
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
export const maxDuration = 60

