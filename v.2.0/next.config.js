/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '10mb'
    }
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Увеличиваем лимит размера тела запроса для загрузки изображений
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '20mb',
  },
}

module.exports = nextConfig

