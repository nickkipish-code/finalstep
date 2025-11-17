/**
 * Утилиты для обработки изображений
 */

import sharp from 'sharp'

/**
 * Конвертация Buffer в base64 data URL
 */
export function bufferToDataURL(buffer: Buffer, mimeType: string = 'image/png'): string {
  const base64 = buffer.toString('base64')
  return `data:${mimeType};base64,${base64}`
}

/**
 * Конвертация data URL в Buffer
 */
export function dataURLToBuffer(dataURL: string): Buffer {
  const matches = dataURL.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL format')
  }
  return Buffer.from(matches[2], 'base64')
}

/**
 * Изменение размера изображения
 */
export async function resizeImage(
  buffer: Buffer,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<Buffer> {
  return sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toBuffer()
}

/**
 * Конвертация изображения в RGB формат
 */
export async function convertToRGB(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .removeAlpha()
    .toFormat('png')
    .toBuffer()
}

/**
 * Получение информации об изображении
 */
export async function getImageInfo(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata()
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: buffer.length,
  }
}

/**
 * Подготовка изображения для Gemini API
 * - Конвертация в PNG
 * - Изменение размера если нужно
 * - Конвертация в base64
 */
export async function prepareImageForGemini(buffer: Buffer): Promise<{
  data: string
  mimeType: string
}> {
  // Оптимизация размера если изображение слишком большое
  const info = await getImageInfo(buffer)
  let processedBuffer = buffer

  if (info.width && info.height && (info.width > 1920 || info.height > 1080)) {
    console.log(`📐 Изменение размера изображения: ${info.width}x${info.height} -> макс 1920x1080`)
    processedBuffer = await resizeImage(buffer)
  }

  // Конвертация в PNG если нужно
  if (info.format !== 'png') {
    console.log(`🔄 Конвертация изображения из ${info.format} в PNG`)
    processedBuffer = await sharp(processedBuffer).png().toBuffer()
  }

  // Конвертация в base64
  const base64 = processedBuffer.toString('base64')

  return {
    data: base64,
    mimeType: 'image/png',
  }
}

/**
 * Создание watermark на изображении
 */
export async function addWatermark(
  buffer: Buffer,
  text: string = 'Virtual Fitting Room'
): Promise<Buffer> {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  if (!metadata.width || !metadata.height) {
    throw new Error('Не удалось получить размеры изображения')
  }

  // Создаём SVG с текстом
  const svgText = `
    <svg width="${metadata.width}" height="${metadata.height}">
      <text 
        x="${metadata.width - 10}" 
        y="${metadata.height - 10}" 
        font-family="Arial" 
        font-size="20" 
        fill="rgba(255, 255, 255, 0.7)" 
        text-anchor="end"
      >
        ${text}
      </text>
    </svg>
  `

  return image
    .composite([
      {
        input: Buffer.from(svgText),
        gravity: 'southeast',
      },
    ])
    .toBuffer()
}

