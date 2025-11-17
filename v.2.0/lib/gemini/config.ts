/**
 * Конфигурация Google Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Проверяем наличие API ключа
const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY не найден в переменных окружения!')
}

// Инициализация Google Generative AI клиента
export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

// Названия моделей
export const MODEL_NAMES = {
  FLASH_IMAGE: 'gemini-2.0-flash-exp',
  FLASH: 'gemini-1.5-flash',
  PRO: 'gemini-1.5-pro'
} as const

/**
 * Получить модель для генерации изображений
 */
export function getImageModel() {
  if (!genAI) {
    throw new Error('Gemini API не настроен. Проверьте GEMINI_API_KEY в .env.local')
  }

  try {
    // Пытаемся использовать модель для генерации изображений
    return genAI.getGenerativeModel({ 
      model: MODEL_NAMES.FLASH_IMAGE,
    })
  } catch (error) {
    console.warn('⚠️ Не удалось загрузить gemini-2.0-flash-exp, используем fallback')
    // Fallback на обычную модель
    return genAI.getGenerativeModel({ 
      model: MODEL_NAMES.FLASH,
    })
  }
}

/**
 * Получить модель для анализа изображений
 */
export function getVisionModel() {
  if (!genAI) {
    throw new Error('Gemini API не настроен. Проверьте GEMINI_API_KEY в .env.local')
  }

  return genAI.getGenerativeModel({ 
    model: MODEL_NAMES.FLASH,
  })
}

export const GEMINI_CONFIG = {
  maxRetries: 3,
  baseRetryDelay: 16, // секунд
  timeout: 60000, // 60 секунд
} as const

