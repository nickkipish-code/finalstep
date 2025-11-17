'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    { label: 'Возможности', href: '#features' },
    { label: 'Как работает', href: '#how-it-works' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 glass ${theme === 'neon' ? 'border-b border-pink-500/30' : ''}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center ${theme === 'neon' ? 'neon-glow' : ''}`}>
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className={`text-xl font-bold gradient-text ${theme === 'neon' ? 'font-oxanium tracking-wider' : ''}`}>
              Virtual Fitting Room v2.0
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-gray-300 hover:text-white transition-colors relative ${
                  theme === 'neon' 
                    ? 'hover:text-pink-400 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-pink-500 after:to-purple-500 hover:after:w-full after:transition-all after:duration-300' 
                    : ''
                }`}
              >
                {item.label}
              </a>
            ))}
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-all ${
                theme === 'neon' 
                  ? 'bg-pink-500/20 text-pink-300' 
                  : 'bg-purple-500/20 text-purple-300'
              }`}
              title="Переключить тему"
            >
              <Palette className="w-5 h-5" />
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2"
            >
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  toggleTheme()
                  setIsMenuOpen(false)
                }}
                className="w-full text-left py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                <span>Сменить тему</span>
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

