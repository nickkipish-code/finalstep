'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, Upload, X, Image as ImageIcon, ImageOff, Link as LinkIcon } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import ImageCanvas from './ImageCanvas'
import { useTheme } from '@/contexts/ThemeContext'

type Mode = 'text' | 'image' | 'background' | 'url'

export default function FittingRoom({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme()
  const [mode, setMode] = useState<Mode>('text')
  const [personImage, setPersonImage] = useState<string | null>(null)
  const [clothingImage, setClothingImage] = useState<string | null>(null)
  const [clothingDescription, setClothingDescription] = useState('')
  const [backgroundDescription, setBackgroundDescription] = useState('')
  const [cameraAngle, setCameraAngle] = useState('')
  const [productUrl, setProductUrl] = useState('')
  const [urlDescription, setUrlDescription] = useState('')
  const [extractingImages, setExtractingImages] = useState(false)
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

    if (mode === 'background' && !backgroundDescription.trim()) {
      setError('Пожалуйста, введите описание фона')
      return
    }

    if (mode === 'url' && !productUrl.trim()) {
      setError('Пожалуйста, введите ссылку на товар')
      return
    }

    if (mode === 'url') {
      try {
        new URL(productUrl)
      } catch {
        setError('Пожалуйста, введите корректную ссылку (начинается с http:// или https://)')
        return
      }
    }

    setLoading(true)
    setError(null)
    setResultImage(null)

    try {
      const formData = new FormData()

      const personFile = personFileRef.current || dataURLtoFile(personImage, 'person.png')
      formData.append('person_image', personFile)

      let apiEndpoint = ''

      if (mode === 'background') {
        formData.append('background_description', backgroundDescription)
        if (cameraAngle.trim()) {
          formData.append('camera_angle', cameraAngle)
        }
        apiEndpoint = '/api/try-on/background'
      } else if (mode === 'text') {
        formData.append('clothing_description', clothingDescription)
        apiEndpoint = '/api/try-on/text'
      } else if (mode === 'url') {
        console.log('🔗 Начинаем обработку ссылки:', productUrl)
        setExtractingImages(true)
        formData.append('product_url', productUrl)
        if (urlDescription.trim()) {
          formData.append('description', urlDescription)
        }
        apiEndpoint = '/api/try-on/url'
      } else {
        const clothingFile = clothingFileRef.current || dataURLtoFile(clothingImage!, 'clothing.png')
        formData.append('clothing_image', clothingFile)
        if (clothingDescription.trim()) {
          formData.append('description', clothingDescription)
        }
        apiEndpoint = '/api/try-on/image'
      }

      const response = await axios.post(apiEndpoint, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const imageUrl = URL.createObjectURL(response.data)
      setResultImage(imageUrl)
      setExtractingImages(false)
    } catch (err: any) {
      console.error('Ошибка генерации:', err)
      setExtractingImages(false)
      
      let errorMessage = 'Произошла ошибка при генерации образа'
      
      if (err.response) {
        const status = err.response.status
        let detail = err.response.data?.detail || err.response.data?.error || err.response.data?.message
        
        if (err.response.data instanceof Blob) {
          try {
            const text = await err.response.data.text()
            const json = JSON.parse(text)
            detail = json.detail || json.error || json.message || detail
          } catch {
            // Используем исходное сообщение
          }
        }
        
        if (status === 429) {
          errorMessage = detail || 'Превышена квота Gemini API. Пожалуйста, подождите немного и попробуйте снова.'
        } else if (status === 500) {
          errorMessage = detail || 'Ошибка сервера при генерации'
        } else if (status === 400) {
          errorMessage = detail || 'Неверный запрос. Проверьте введенные данные'
        } else {
          errorMessage = detail || `Ошибка ${status}: ${err.response.statusText}`
        }
      } else if (err.request) {
        errorMessage = 'Не удалось подключиться к серверу'
      } else {
        errorMessage = err.message || 'Ошибка при отправке запроса'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
      setExtractingImages(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>

          <div className={`flex flex-wrap gap-2 glass rounded-lg p-1 ${theme === 'neon' ? 'border border-pink-500/30' : ''}`}>
            <motion.button
              onClick={() => {
                setMode('text')
                setClothingImage(null)
                clothingFileRef.current = null
              }}
              whileHover={theme === 'neon' ? { scale: 1.05 } : {}}
              className={`px-4 py-2 rounded-md transition-all text-sm ${
                mode === 'text'
                  ? theme === 'neon'
                    ? 'neon-button bg-black/50 text-pink-300'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Фото + Текст
            </motion.button>
            <motion.button
              onClick={() => {
                setMode('image')
                setClothingDescription('')
              }}
              whileHover={theme === 'neon' ? { scale: 1.05 } : {}}
              className={`px-4 py-2 rounded-md transition-all text-sm ${
                mode === 'image'
                  ? theme === 'neon'
                    ? 'neon-button bg-black/50 text-pink-300'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Фото + Фото
            </motion.button>
            <motion.button
              onClick={() => {
                setMode('background')
                setClothingDescription('')
                setClothingImage(null)
                clothingFileRef.current = null
              }}
              whileHover={theme === 'neon' ? { scale: 1.05 } : {}}
              className={`px-4 py-2 rounded-md transition-all text-sm flex items-center gap-2 ${
                mode === 'background'
                  ? theme === 'neon'
                    ? 'neon-button bg-black/50 text-pink-300'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <ImageOff className="w-4 h-4" />
              Смена фона
            </motion.button>
            <motion.button
              onClick={() => {
                setMode('url')
                setClothingDescription('')
                setClothingImage(null)
                clothingFileRef.current = null
              }}
              whileHover={theme === 'neon' ? { scale: 1.05 } : {}}
              className={`px-4 py-2 rounded-md transition-all text-sm flex items-center gap-2 ${
                mode === 'url'
                  ? theme === 'neon'
                    ? 'neon-button bg-black/50 text-pink-300'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              По ссылке
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Фото человека</h3>
            <div
              onDrop={(e) => handleDrop(e, 'person')}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                theme === 'neon'
                  ? 'border-pink-500/30 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'border-gray-600 hover:border-purple-500'
              }`}
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

          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {mode === 'background' 
                ? 'Описание фона' 
                : mode === 'text' 
                ? 'Описание одежды' 
                : mode === 'url'
                ? 'Ссылка на товар'
                : 'Фото одежды'}
            </h3>
            {mode === 'url' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ссылка на товар <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://prom.ua/... или https://olx.ua/..."
                    className={`w-full bg-black/30 border rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none ${
                      theme === 'neon'
                        ? 'border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                        : 'border-gray-600 focus:border-purple-500'
                    }`}
                  />
                  {extractingImages && (
                    <div className="text-sm text-yellow-400 mt-2">
                      🔍 Извлекаем изображения товара...
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Дополнительное описание (опционально)
                  </label>
                  <textarea
                    value={urlDescription}
                    onChange={(e) => setUrlDescription(e.target.value)}
                    placeholder="Например: красное платье, размер M"
                    className={`w-full h-24 bg-black/30 border rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none resize-none ${
                      theme === 'neon'
                        ? 'border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                        : 'border-gray-600 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>
            ) : mode === 'background' ? (
              <div className="space-y-4">
                <textarea
                  value={backgroundDescription}
                  onChange={(e) => setBackgroundDescription(e.target.value)}
                  placeholder="Например: пляж с белым песком и голубым океаном, солнечный день"
                  className={`w-full h-32 bg-black/30 border rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none resize-none ${
                    theme === 'neon'
                      ? 'border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                      : 'border-gray-600 focus:border-purple-500'
                  }`}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ракурс камеры <span className="text-yellow-400">(опционально)</span>
                  </label>
                  <input
                    type="text"
                    value={cameraAngle}
                    onChange={(e) => setCameraAngle(e.target.value)}
                    placeholder="Например: вид сбоку, низкий ракурс, вид сверху"
                    className={`w-full bg-black/30 border rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none ${
                      theme === 'neon'
                        ? 'border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                        : 'border-gray-600 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>
            ) : mode === 'text' ? (
              <textarea
                value={clothingDescription}
                onChange={(e) => setClothingDescription(e.target.value)}
                placeholder="Например: элегантное красное платье до колен"
                className={`w-full h-48 bg-black/30 border rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none resize-none ${
                  theme === 'neon'
                    ? 'border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                    : 'border-gray-600 focus:border-purple-500'
                }`}
              />
            ) : (
              <div
                onDrop={(e) => handleDrop(e, 'clothing')}
                onDragOver={(e) => e.preventDefault()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                theme === 'neon'
                  ? 'border-pink-500/30 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'border-gray-600 hover:border-purple-500'
              }`}
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
          </div>

          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Результат</h3>
            <div className="h-64 md:h-auto">
              <ImageCanvas imageUrl={resultImage} loading={loading} />
            </div>
          </div>
        </div>

        <div className="text-center">
          <motion.button
            onClick={handleTryOn}
            disabled={loading || extractingImages}
            whileHover={!loading && !extractingImages && theme === 'neon' ? { scale: 1.05 } : {}}
            whileTap={!loading && !extractingImages ? { scale: 0.95 } : {}}
            className={`px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'neon'
                ? 'neon-button bg-black/50 text-pink-300 hover:text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 disabled:transform-none'
            }`}
          >
            {extractingImages 
              ? 'Извлекаем изображения...' 
              : loading 
                ? (mode === 'background' ? 'Меняем фон...' : mode === 'url' ? 'Применяем одежду...' : 'Создаём образ...') 
                : (mode === 'background' ? 'Сменить фон' : mode === 'url' ? 'Применить' : 'Примерить')}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

