'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Download, Loader2, ZoomIn, ZoomOut, RotateCw, Move, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'

interface ImageCanvasProps {
  imageUrl: string | null
  loading?: boolean
}

export default function ImageCanvas({ imageUrl, loading }: ImageCanvasProps) {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  
  const [downloading, setDownloading] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      imageRef.current = img
      
      const container = containerRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
      
      setImageLoaded(true)
      drawImage()
    }
    
    img.onerror = () => {
      console.error('Ошибка загрузки изображения')
      setImageLoaded(false)
    }
    
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (imageLoaded) {
      drawImage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, position, rotation, imageLoaded])

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const img = imageRef.current
    
    if (!canvas || !ctx || !img) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(scale, scale)
    ctx.translate(position.x / scale, position.y / scale)
    
    const imgAspect = img.width / img.height
    const canvasAspect = canvas.width / canvas.height
    
    let drawWidth = canvas.width * 0.9
    let drawHeight = canvas.height * 0.9
    
    if (imgAspect > canvasAspect) {
      drawHeight = drawWidth / imgAspect
    } else {
      drawWidth = drawHeight * imgAspect
    }
    
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    ctx.restore()
  }, [scale, position, rotation])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.1, Math.min(5, prev + delta)))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }

  const handleDownload = async () => {
    if (!canvasRef.current || !imageUrl) return

    setDownloading(true)
    try {
      const exportCanvas = document.createElement('canvas')
      const img = imageRef.current
      
      if (img) {
        exportCanvas.width = img.width
        exportCanvas.height = img.height
        const ctx = exportCanvas.getContext('2d')
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height)
          
          exportCanvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'virtual-fitting-room-result.png'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
            }
          }, 'image/png')
        }
      }
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
          <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${
            theme === 'neon' ? 'text-pink-500' : 'text-purple-500'
          }`} />
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
      <div className={`flex items-center justify-between mb-4 p-2 rounded-lg ${
        theme === 'neon' 
          ? 'bg-black/30 border border-pink-500/30' 
          : 'bg-black/20'
      }`}>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => handleZoom(-0.1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded text-gray-400 hover:text-white transition-all"
            title="Уменьшить"
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>
          
          <span className="text-sm text-gray-400 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <motion.button
            onClick={() => handleZoom(0.1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded text-gray-400 hover:text-white transition-all"
            title="Увеличить"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={handleRotate}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded text-gray-400 hover:text-white transition-all"
            title="Повернуть на 90°"
          >
            <RotateCw className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded text-gray-400 hover:text-white transition-all"
            title="Сбросить"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50 ${
            theme === 'neon'
              ? 'bg-pink-500/30 text-pink-300 hover:bg-pink-500/50'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
          }`}
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Скачивание...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Скачать</span>
            </>
          )}
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 relative rounded-lg overflow-hidden border border-gray-700 bg-gray-900 cursor-move"
        onWheel={(e) => {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          handleZoom(delta)
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none' }}
        />
        
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">
          Перетащите для перемещения • Колесо мыши для масштабирования
        </div>
      </div>
    </div>
  )
}

