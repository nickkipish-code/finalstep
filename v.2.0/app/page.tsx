'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import FittingRoom from '@/components/FittingRoom'
import Footer from '@/components/Footer'
import NeonGridBackground from '@/components/NeonGridBackground'
import { useTheme } from '@/contexts/ThemeContext'

export default function Home() {
  const [showFittingRoom, setShowFittingRoom] = useState(false)
  const { theme } = useTheme()

  return (
    <main className="min-h-screen relative">
      {theme === 'neon' && <NeonGridBackground />}
      <Header />
      {showFittingRoom ? (
        <FittingRoom onBack={() => setShowFittingRoom(false)} />
      ) : (
        <>
          <Hero onStartClick={() => setShowFittingRoom(true)} />
          <Features />
          <Footer />
        </>
      )}
    </main>
  )
}

