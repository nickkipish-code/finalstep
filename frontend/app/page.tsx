'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import FittingRoom from '@/components/FittingRoom'
import Footer from '@/components/Footer'

export default function Home() {
  const [showFittingRoom, setShowFittingRoom] = useState(false)

  return (
    <main className="min-h-screen">
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

