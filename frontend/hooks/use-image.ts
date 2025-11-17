/**
 * Custom hook для работы с изображениями
 * Можно расширить для дополнительной функциональности
 */

import { useState } from 'react'

export function useImage() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadImage = (file: File) => {
    setLoading(true)
    setError(null)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
      setLoading(false)
    }
    reader.onerror = () => {
      setError('Ошибка загрузки изображения')
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImage(null)
    setError(null)
  }

  return {
    image,
    loading,
    error,
    loadImage,
    clearImage,
  }
}

