'use client'

import { motion } from 'framer-motion'
import { Image, Type, Sparkles, Zap } from 'lucide-react'

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
    title: 'Фото одежды',
    description: 'Или загрузите фото одежды для примерки',
  },
  {
    icon: Zap,
    title: 'Быстрый результат',
    description: 'Получите результат за несколько секунд',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 gradient-text"
        >
          Возможности
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-lg p-6 hover:bg-black/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

