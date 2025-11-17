'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'classic' | 'neon'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('classic')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Загружаем сохраненную тему из localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.body.classList.remove('theme-classic', 'theme-neon')
      document.body.classList.add(`theme-${savedTheme}`)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'classic' ? 'neon' : 'classic'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.body.classList.remove('theme-classic', 'theme-neon')
    document.body.classList.add(`theme-${newTheme}`)
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

