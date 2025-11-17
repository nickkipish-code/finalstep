'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface HeroProps {
  onStartClick: () => void
}

export default function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-purple-500 mr-3" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Виртуальная примерочная
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          с использованием AI
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Загрузите своё фото и опишите одежду текстом или загрузите фото одежды.
          AI создаст реалистичное изображение вас в этой одежде.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={onStartClick}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Начать примерку
          </button>
        </motion.div>
      </div>
    </section>
  )
}

