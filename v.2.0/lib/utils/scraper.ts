/**
 * Утилиты для парсинга изображений с веб-страниц
 */

import * as cheerio from 'cheerio'
import { chromium } from 'playwright'

/**
 * Извлечение URL изображений товара из HTML
 */
export async function extractImageURLsFromHTML(
  html: string,
  baseUrl: string
): Promise<string[]> {
  const $ = cheerio.load(html)
  const imageUrls = new Set<string>()

  // Селекторы для поиска изображений товара
  const selectors = [
    'img[class*="product"]',
    'img[class*="item"]',
    'img[class*="goods"]',
    'img[class*="photo"]',
    'img[data-src]',
    'img[src*="product"]',
    'img[src*="item"]',
    '.product-image img',
    '.item-image img',
    '.goods-image img',
    '[class*="product-image"] img',
    '[class*="item-image"] img',
  ]

  // Поиск по селекторам
  selectors.forEach((selector) => {
    $(selector).each((_, element) => {
      const $img = $(element)
      let imgUrl = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src')

      if (imgUrl) {
        // Преобразование относительных URL в абсолютные
        if (imgUrl.startsWith('//')) {
          imgUrl = 'https:' + imgUrl
        } else if (imgUrl.startsWith('/')) {
          const url = new URL(baseUrl)
          imgUrl = url.origin + imgUrl
        } else if (!imgUrl.startsWith('http')) {
          imgUrl = new URL(imgUrl, baseUrl).href
        }

        // Фильтрация маленьких изображений (иконки, логотипы)
        const skipKeywords = ['icon', 'logo', 'avatar', 'thumb', 'small', 'banner', 'ad']
        if (!skipKeywords.some((keyword) => imgUrl.toLowerCase().includes(keyword))) {
          imageUrls.add(imgUrl)
        }
      }
    })
  })

  // Если не нашли через селекторы, ищем все изображения
  if (imageUrls.size === 0) {
    $('img').each((_, element) => {
      const $img = $(element)
      let imgUrl = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src')

      if (imgUrl) {
        if (imgUrl.startsWith('//')) {
          imgUrl = 'https:' + imgUrl
        } else if (imgUrl.startsWith('/')) {
          const url = new URL(baseUrl)
          imgUrl = url.origin + imgUrl
        } else if (!imgUrl.startsWith('http')) {
          imgUrl = new URL(imgUrl, baseUrl).href
        }

        const skipKeywords = ['icon', 'logo', 'avatar', 'thumb', 'small', 'banner', 'ad']
        if (!skipKeywords.some((keyword) => imgUrl.toLowerCase().includes(keyword))) {
          imageUrls.add(imgUrl)
        }
      }
    })
  }

  return Array.from(imageUrls)
}

/**
 * Загрузка изображений по URL
 */
export async function downloadImages(imageUrls: string[]): Promise<Buffer[]> {
  const images: Buffer[] = []

  for (const url of imageUrls.slice(0, 5)) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })

      if (!response.ok) continue

      const contentType = response.headers.get('content-type')
      if (!contentType?.startsWith('image/')) continue

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Фильтрация очень маленьких изображений
      if (buffer.length > 1024 * 10) {
        // > 10KB
        images.push(buffer)
        console.log(`✅ Загружено изображение: ${url.slice(0, 60)}... (${buffer.length} bytes)`)
      }
    } catch (error: any) {
      console.warn(`⚠️ Не удалось загрузить изображение ${url}: ${error.message}`)
    }
  }

  return images
}

/**
 * Создание скриншота страницы используя Playwright
 */
export async function takeScreenshot(url: string): Promise<Buffer> {
  let browser
  
  try {
    console.log(`📸 Делаем скриншот страницы: ${url}`)
    
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    
    const page = await context.newPage()
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    
    // Ждем немного для загрузки динамического контента
    await page.waitForTimeout(2000)
    
    const screenshot = await page.screenshot({ fullPage: true, type: 'png' })
    
    await browser.close()
    
    console.log(`✅ Скриншот создан`)
    return Buffer.from(screenshot)
  } catch (error: any) {
    if (browser) {
      await browser.close()
    }
    
    console.error(`❌ Ошибка создания скриншота: ${error.message}`)
    throw new Error(`Не удалось создать скриншот страницы: ${error.message}`)
  }
}

/**
 * Извлечение изображений товара из ссылки
 */
export async function extractProductImages(url: string): Promise<Buffer[]> {
  try {
    console.log(`🔍 Анализируем ссылку: ${url}`)

    // Получаем HTML страницы
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Извлекаем URL изображений из HTML
    const imageUrls = await extractImageURLsFromHTML(html, url)
    console.log(`📸 Найдено ${imageUrls.length} URL изображений`)

    // Загружаем изображения
    let images = await downloadImages(imageUrls)

    // Если не нашли изображения через парсинг, делаем скриншот
    if (images.length === 0) {
      console.log('⚠️ Изображения не найдены через парсинг HTML, делаем скриншот...')
      const screenshot = await takeScreenshot(url)
      images = [screenshot]
    }

    console.log(`✅ Успешно извлечено ${images.length} изображений товара`)
    return images
  } catch (error: any) {
    console.error(`❌ Ошибка извлечения изображений: ${error.message}`)
    throw new Error(`Ошибка при извлечении изображений: ${error.message}`)
  }
}

