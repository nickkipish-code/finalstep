'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react'
import axios from 'axios'
import ImageCanvas from './ImageCanvas'

type Mode = 'text' | 'image'

export default function FittingRoom({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('text')
  const [personImage, setPersonImage] = useState<string | null>(null)
  const [clothingImage, setClothingImage] = useState<string | null>(null)
  const [clothingDescription, setClothingDescription] = useState('')
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const personFileRef = useRef<File | null>(null)
  const clothingFileRef = useRef<File | null>(null)
  const personInputRef = useRef<HTMLInputElement>(null)
  const clothingInputRef = useRef<HTMLInputElement>(null)

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const handlePersonImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, загрузите изображение')
      return
    }

    personFileRef.current = file
    const reader = new FileReader()
    reader.onloadend = () => {
      setPersonImage(reader.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleClothingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, загрузите изображение')
      return
    }

    clothingFileRef.current = file
    const reader = new FileReader()
    reader.onloadend = () => {
      setClothingImage(reader.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: 'person' | 'clothing'
  ) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return

    if (type === 'person') {
      personFileRef.current = file
      const reader = new FileReader()
      reader.onloadend = () => {
        setPersonImage(reader.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    } else {
      clothingFileRef.current = file
      const reader = new FileReader()
      reader.onloadend = () => {
        setClothingImage(reader.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTryOn = async () => {
    if (!personImage) {
      setError('Пожалуйста, загрузите фото человека')
      return
    }

    if (mode === 'text' && !clothingDescription.trim()) {
      setError('Пожалуйста, введите описание одежды')
      return
    }

    if (mode === 'image' && !clothingImage) {
      setError('Пожалуйста, загрузите фото одежды')
      return
    }

    setLoading(true)
    setError(null)
    setResultImage(null)

    try {
      const formData = new FormData()

      // Конвертация base64 в File для человека
      const personFile = personFileRef.current || dataURLtoFile(personImage, 'person.png')
      formData.append('person_image', personFile)

      if (mode === 'text') {
        // Text to Image
        formData.append('clothing_description', clothingDescription)
        formData.append('strength', '0.75')

        const response = await axios.post(
          'http://localhost:8000/api/try-on/text',
          formData,
          { responseType: 'blob' }
        )

        const imageUrl = URL.createObjectURL(response.data)
        setResultImage(imageUrl)
      } else {
        // Image to Image
        const clothingFile = clothingFileRef.current || dataURLtoFile(clothingImage!, 'clothing.png')
        formData.append('clothing_image', clothingFile)
        if (clothingDescription.trim()) {
          formData.append('description', clothingDescription)
        }
        formData.append('strength', '0.75')

        const response = await axios.post(
          'http://localhost:8000/api/try-on/image',
          formData,
          { responseType: 'blob' }
        )

        const imageUrl = URL.createObjectURL(response.data)
        setResultImage(imageUrl)
      }
    } catch (err: any) {
      console.error('Ошибка генерации:', err)
      setError(err.response?.data?.detail || 'Произошла ошибка при генерации образа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>

          {/* Mode Tabs */}
          <div className="flex space-x-2 glass rounded-lg p-1">
            <button
              onClick={() => {
                setMode('text')
                setClothingImage(null)
                clothingFileRef.current = null
              }}
              className={`px-4 py-2 rounded-md transition-all ${
                mode === 'text'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Фото + Текст
            </button>
            <button
              onClick={() => {
                setMode('image')
                setClothingDescription('')
              }}
              className={`px-4 py-2 rounded-md transition-all ${
                mode === 'image'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Фото + Фото
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Person Image */}
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Фото человека</h3>
            <div
              onDrop={(e) => handleDrop(e, 'person')}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => personInputRef.current?.click()}
            >
              {personImage ? (
                <div className="relative">
                  <img
                    src={personImage}
                    alt="Person"
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPersonImage(null)
                      personFileRef.current = null
                      if (personInputRef.current) personInputRef.current.value = ''
                    }}
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Нажмите или перетащите фото</p>
                </div>
              )}
              <input
                ref={personInputRef}
                type="file"
                accept="image/*"
                onChange={handlePersonImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Clothing Input */}
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {mode === 'text' ? 'Описание одежды' : 'Фото одежды'}
            </h3>
            {mode === 'text' ? (
              <textarea
                value={clothingDescription}
                onChange={(e) => setClothingDescription(e.target.value)}
                placeholder="Например: элегантное красное платье до колен"
                className="w-full h-48 bg-black/30 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            ) : (
              <div
                onDrop={(e) => handleDrop(e, 'clothing')}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => clothingInputRef.current?.click()}
              >
                {clothingImage ? (
                  <div className="relative">
                    <img
                      src={clothingImage}
                      alt="Clothing"
                      className="w-full h-auto rounded-lg mb-4"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setClothingImage(null)
                        clothingFileRef.current = null
                        if (clothingInputRef.current) clothingInputRef.current.value = ''
                      }}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Нажмите или перетащите фото</p>
                  </div>
                )}
                <input
                  ref={clothingInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleClothingImageUpload}
                  className="hidden"
                />
              </div>
            )}
            {mode === 'image' && (
              <textarea
                value={clothingDescription}
                onChange={(e) => setClothingDescription(e.target.value)}
                placeholder="Дополнительное описание (опционально)"
                className="w-full h-24 mt-4 bg-black/30 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            )}
          </div>

          {/* Result */}
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Результат</h3>
            <div className="h-64 md:h-auto">
              <ImageCanvas imageUrl={resultImage} loading={loading} />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleTryOn}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Создаём образ...' : 'Примерить'}
          </button>
        </div>
      </div>
    </div>
  )
}

