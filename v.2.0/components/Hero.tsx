'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface HeroProps {
  onStartClick: () => void
}

export default function Hero({ onStartClick }: HeroProps) {
  const { theme } = useTheme()
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    if (theme === 'neon') {
      const timer = setTimeout(() => {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 300)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [theme])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative">
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={glitch ? 'glitch-effect' : ''}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={theme === 'neon' ? {
                filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse' as const,
              }}
            >
              <Sparkles className={`w-12 h-12 mr-3 ${theme === 'neon' ? 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'text-purple-500'}`} />
            </motion.div>
            <h1 className={`text-5xl md:text-6xl font-bold gradient-text ${theme === 'neon' ? 'font-oxanium tracking-wider' : ''}`}>
              Virtual Fitting Room
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-xl md:text-2xl mb-8 ${theme === 'neon' ? 'text-pink-300 font-rajdhani' : 'text-gray-300'}`}
        >
          v2.0 - Полностью на Next.js с AI
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`text-lg mb-12 max-w-2xl mx-auto ${theme === 'neon' ? 'text-gray-400' : 'text-gray-400'}`}
        >
          Загрузите своё фото и опишите одежду текстом, загрузите фото одежды или вставьте ссылку на товар.
          AI создаст реалистичное изображение вас в этой одежде.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            onClick={onStartClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all ${
              theme === 'neon'
                ? 'neon-button bg-black/50 text-pink-300 hover:text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50'
            }`}
          >
            Начать примерку
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

