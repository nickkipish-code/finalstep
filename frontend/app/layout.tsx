import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Virtual Fitting Room - Виртуальная примерочная с AI',
  description: 'Виртуальная примерка одежды с использованием Google Gemini 2.5 Flash Image',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

