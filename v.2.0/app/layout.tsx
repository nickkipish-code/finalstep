import type { Metadata } from 'next'
import { Oxanium, Rajdhani, Space_Mono, Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Virtual Fitting Room v2.0 - AI примерочная',
  description: 'Виртуальная примерка одежды с использованием Google Gemini AI - полностью на Next.js',
  keywords: ['виртуальная примерка', 'AI', 'примерочная', 'Gemini', 'Next.js'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${oxanium.variable} ${rajdhani.variable} ${spaceMono.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

