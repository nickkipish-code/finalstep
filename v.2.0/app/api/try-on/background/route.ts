/**
 * Background Change endpoint
 * Смена фона и ракурса изображения
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateTryOnImage } from '@/lib/gemini/generators'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Получаем данные из формы
    const personImageFile = formData.get('person_image') as File
    const backgroundDescription = formData.get('background_description') as string
    const cameraAngle = formData.get('camera_angle') as string | null
    
    if (!personImageFile) {
      return NextResponse.json(
        { error: 'Не предоставлено изображение человека' },
        { status: 400 }
      )
    }
    
    if (!backgroundDescription) {
      return NextResponse.json(
        { error: 'Не предоставлено описание фона' },
        { status: 400 }
      )
    }
    
    console.log(`📸 Получено изображение человека: ${personImageFile.name}`)
    console.log(`🌆 Описание фона: ${backgroundDescription}`)
    if (cameraAngle) {
      console.log(`📐 Ракурс: ${cameraAngle}`)
    }
    
    // Конвертация File в Buffer
    const personImageBuffer = Buffer.from(await personImageFile.arrayBuffer())
    
    // Генерация результата
    const resultBuffer = await generateTryOnImage({
      personImage: personImageBuffer,
      backgroundDescription,
      cameraAngle: cameraAngle || undefined,
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

