# Virtual Fitting Room - Виртуальная примерочная с AI

Веб-приложение для виртуальной примерки одежды с использованием Google Gemini 2.5 Flash Image (Nano Banana).

## 🎯 Назначение

Пользователь загружает фото и либо описывает одежду текстом, либо загружает фото одежды, после чего AI генерирует изображение человека в этой одежде.

## 🚀 Быстрый старт

### Требования

- Python 3.9+
- Node.js 18+
- Google Gemini API ключ ([получить здесь](https://aistudio.google.com/app/apikey))

### Установка

1. **Клонируйте репозиторий** (или используйте существующий проект)

2. **Установите зависимости Backend:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

3. **Настройте API ключ:**
   - Получите ключ на [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Создайте файл `backend/.env`:
     ```
     GEMINI_API_KEY=ваш_ключ_здесь
     ```

4. **Установите зависимости Frontend:**
   ```bash
   cd frontend
   npm install
   ```

### Запуск

**Вариант 1: Автоматический (Windows)**
```bash
install.bat  # Первый раз
start.bat    # Запуск
```

**Вариант 2: Ручной**

Terminal 1 (Backend):
```bash
cd backend
venv\Scripts\activate
python main.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

```
Primer/
├── backend/              # Python Backend
│   ├── main.py          # FastAPI + Gemini API
│   ├── requirements.txt # Python зависимости
│   ├── backend_test.py  # Тестовый скрипт
│   └── .env             # API ключи (не в Git!)
│
├── frontend/            # Next.js Frontend
│   ├── app/            # Next.js 14 App Router
│   ├── components/     # React компоненты
│   ├── hooks/          # Custom hooks
│   └── public/         # Статические файлы
│
├── README.md           # Этот файл
├── GEMINI_2.5_SETUP.md # Детальная настройка Gemini
└── start.bat           # Скрипт запуска
```

## 🎨 Технологии

### Backend
- **Python 3.9+**
- **FastAPI** - async веб-фреймворк
- **Uvicorn** - ASGI сервер
- **Google Generative AI SDK** - для Gemini API
- **Pillow (PIL)** - обработка изображений

### Frontend
- **Next.js 14** - React фреймворк (App Router)
- **TypeScript** - строгая типизация
- **Tailwind CSS** - utility-first CSS
- **Framer Motion** - анимации
- **Lucide React** - иконки
- **Axios** - HTTP клиент

### AI Engine
- **Google Gemini 2.5 Flash Image** (Nano Banana 🍌)
  - Экспериментальная модель для генерации изображений
  - Бесплатный tier: 60 запросов/мин, 1,500/день
  - Отличное качество генерации

## 📖 API Endpoints

### GET `/`
Health check endpoint

### GET `/health`
Детальная проверка здоровья API

### POST `/api/try-on/text`
Text to Image генерация

**Параметры:**
- `person_image` (file) - Фото человека
- `clothing_description` (string) - Описание одежды
- `strength` (float, optional) - Сила применения

**Ответ:** PNG изображение

### POST `/api/try-on/image`
Image to Image генерация

**Параметры:**
- `person_image` (file) - Фото человека
- `clothing_image` (file) - Фото одежды
- `description` (string, optional) - Доп. описание
- `strength` (float, optional)

**Ответ:** PNG изображение

## 🎨 UI/UX Дизайн

- **Тема:** Темная с градиентами
- **Стиль:** Минималистичный, вдохновленный Pixlr.com
- **Эффекты:** Glassmorphism, градиенты, анимации
- **Адаптивность:** Mobile-first, responsive design

## 🔧 Настройка

### Переменные окружения

**backend/.env:**
```
GEMINI_API_KEY=your_key_here
```

**frontend (опционально):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Backend не запускается
- Проверьте Python 3.9+
- Проверьте `GEMINI_API_KEY` в `.env`
- Установите зависимости: `pip install -r requirements.txt`

### Frontend не запускается
- Проверьте Node.js 18+
- Очистите кэш: `npm cache clean --force`
- Переустановите зависимости: `npm install`

### "Gemini API не настроен"
- Проверьте файл `backend/.env`
- Убедитесь, что ключ начинается с `AIzaSyC...`

### "Модель не вернула изображение"
- Экспериментальная модель может быть нестабильной
- Проверьте логи backend
- Fallback: возвращается оригинал с watermark

## 📚 Дополнительная документация

- [GEMINI_2.5_SETUP.md](./GEMINI_2.5_SETUP.md) - Детальная настройка Gemini
- [GEMINI_READY.txt](./GEMINI_READY.txt) - Сводка и инструкции
- [START_HERE.md](./START_HERE.md) - Быстрый старт
- [QUICKSTART.md](./QUICKSTART.md) - Краткая инструкция

## 🔗 Полезные ссылки

- [Google AI Studio](https://aistudio.google.com/app/apikey) - Получить API ключ
- [Gemini Documentation](https://ai.google.dev/docs) - Документация Gemini
- [Pricing](https://ai.google.dev/pricing) - Тарифы Gemini API
- [Awesome Nano Banana](https://github.com/JimmyLv/awesome-nano-banana) - Ресурсы о модели

## 📝 Лицензия

MIT License

## 🙏 Благодарности

- Google Gemini 2.5 Flash Image (Nano Banana) 🍌
- Сообщество разработчиков

---

**Создано с ❤️ используя Google Gemini 2.5 Flash Image**

