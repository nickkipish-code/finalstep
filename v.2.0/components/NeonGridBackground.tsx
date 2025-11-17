'use client'

import { useEffect, useRef } from 'react'

export default function NeonGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Параметры сетки
    const gridSize = 50
    const lineWidth = 0.5
    let time = 0
    const points: Array<{ x: number; y: number; vx: number; vy: number }> = []

    // Создаем начальные точки
    const initPoints = () => {
      points.length = 0
      const cols = Math.ceil(canvas.width / gridSize) + 2
      const rows = Math.ceil(canvas.height / gridSize) + 2
      
      for (let i = 0; i < cols * rows; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        points.push({
          x: (col - 1) * gridSize + (Math.random() - 0.5) * 20,
          y: (row - 1) * gridSize + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        })
      }
    }

    initPoints()

    const drawLine = (x1: number, y1: number, x2: number, y2: number, alpha: number) => {
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      const hue = (time * 0.1 + Math.atan2(y2 - y1, x2 - x1) * 57.3) % 360
      gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, ${alpha * 0.3})`)
      gradient.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 100%, 70%, ${alpha * 0.5})`)
      gradient.addColorStop(1, `hsla(${(hue + 120) % 360}, 100%, 60%, ${alpha * 0.3})`)
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.5

      // Обновляем позиции точек
      points.forEach((point) => {
        point.x += point.vx
        point.y += point.vy

        // Отскок от краев
        if (point.x < -gridSize) point.x = canvas.width + gridSize
        if (point.x > canvas.width + gridSize) point.x = -gridSize
        if (point.y < -gridSize) point.y = canvas.height + gridSize
        if (point.y > canvas.height + gridSize) point.y = -gridSize

        // Небольшие случайные изменения направления
        if (Math.random() < 0.01) {
          point.vx += (Math.random() - 0.5) * 0.1
          point.vy += (Math.random() - 0.5) * 0.1
        }
      })

      // Рисуем линии между близкими точками
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[j].x - points[i].x
          const dy = points[j].y - points[i].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < gridSize * 1.5) {
            const alpha = (1 - distance / (gridSize * 1.5)) * (0.5 + 0.5 * Math.sin(time * 0.05))
            drawLine(points[i].x, points[i].y, points[j].x, points[j].y, alpha)
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

