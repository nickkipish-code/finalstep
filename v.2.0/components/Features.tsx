'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image, Type, Sparkles, Zap } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const features = [
  {
    icon: Image,
    title: 'Загрузка фото',
    description: 'Загрузите своё фото для виртуальной примерки',
  },
  {
    icon: Type,
    title: 'Текстовое описание',
    description: 'Опишите одежду текстом, и AI создаст образ',
  },
  {
    icon: Sparkles,
    title: 'Фото одежды или ссылка',
    description: 'Загрузите фото одежды или вставьте ссылку на товар',
  },
  {
    icon: Zap,
    title: 'Быстрый результат',
    description: 'Получите результат за несколько секунд',
  },
]

export default function Features() {
  const { theme } = useTheme()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-4xl font-bold text-center mb-12 gradient-text ${theme === 'neon' ? 'font-oxanium tracking-wider' : ''}`}
        >
          Возможности
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isHovered = hoveredIndex === index
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`glass rounded-lg p-6 transition-all relative overflow-hidden ${
                  theme === 'neon'
                    ? 'hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                    : 'hover:bg-black/30'
                }`}
                whileHover={theme === 'neon' ? { scale: 1.02 } : {}}
              >
                {theme === 'neon' && isHovered && (
                  <motion.div
                    className="absolute inset-0 border-2 border-pink-500/50 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <motion.div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    theme === 'neon'
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 neon-glow'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  animate={theme === 'neon' && isHovered ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'neon' ? 'text-pink-300 font-rajdhani' : ''}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

