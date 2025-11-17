'use client'

export default function Footer() {
  return (
    <footer className="glass mt-20 py-8 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <p className="text-gray-400 mb-2">
          Virtual Fitting Room - Виртуальная примерочная с AI
        </p>
        <p className="text-gray-500 text-sm">
          Powered by Google Gemini 2.5 Flash Image (Nano Banana) 🍌
        </p>
        <p className="text-gray-500 text-sm mt-2">
          © {new Date().getFullYear()} Все права защищены
        </p>
      </div>
    </footer>
  )
}

