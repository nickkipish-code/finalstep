'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface ImageCanvasProps {
  imageUrl: string | null
  loading?: boolean
}

export default function ImageCanvas({ imageUrl, loading }: ImageCanvasProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!imageUrl) return

    setDownloading(true)
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'virtual-fitting-room-result.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Ошибка скачивания:', error)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center glass rounded-lg">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Создаём образ...</p>
        </div>
      </div>
    )
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center glass rounded-lg">
        <p className="text-gray-400">Результат появится здесь</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full glass rounded-lg p-4 flex flex-col">
      <div className="flex-1 relative rounded-lg overflow-hidden mb-4">
        <img
          src={imageUrl}
          alt="Результат примерки"
          className="w-full h-full object-contain"
          crossOrigin="anonymous"
        />
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {downloading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Скачивание...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Скачать результат</span>
          </>
        )}
      </button>
    </div>
  )
}

