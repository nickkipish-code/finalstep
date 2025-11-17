# Деплой на Vercel

## Быстрый старт

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/nickkipish-code/finalstep.git
   cd finalstep
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   
   Создайте файл `.env.local` со следующими переменными:
   
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Google Gemini AI
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   
   # NextAuth
   AUTH_SECRET=your_auth_secret
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

## Деплой на Vercel

### Способ 1: Через Vercel Dashboard (Рекомендуется)

1. Перейдите на [vercel.com](https://vercel.com) и войдите
2. Нажмите "Add New Project"
3. Импортируйте репозиторий `https://github.com/nickkipish-code/finalstep`
4. Настройте переменные окружения в разделе "Environment Variables"
5. Нажмите "Deploy"

### Способ 2: Через Vercel CLI

1. **Установите Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Логин:**
   ```bash
   vercel login
   ```

3. **Деплой:**
   ```bash
   vercel --prod
   ```

## Важные замечания

### Переменные окружения в Vercel

В Vercel Dashboard добавьте следующие переменные:

| Название переменной | Описание |
|---------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL вашего Supabase проекта |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичный ключ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role ключ Supabase |
| `GOOGLE_GEMINI_API_KEY` | API ключ Google Gemini |
| `AUTH_SECRET` | Секретный ключ для NextAuth (сгенерируйте: `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `NEXTAUTH_URL` | URL вашего приложения на Vercel |

### После деплоя

1. **Обновите Google OAuth настройки:**
   - Добавьте URL вашего Vercel приложения в Authorized redirect URIs
   - Пример: `https://your-app.vercel.app/api/auth/callback/google`

2. **Обновите Supabase настройки:**
   - Добавьте URL приложения в Site URL
   - Добавьте в Redirect URLs: `https://your-app.vercel.app/**`

## Автоматический деплой

Vercel автоматически деплоит:
- **Production**: При push в ветку `main`
- **Preview**: При создании Pull Request

## Мониторинг

- Логи доступны в Vercel Dashboard
- Аналитика и метрики в разделе Analytics
- Сообщения об ошибках в разделе Runtime Logs

## Домен

По умолчанию Vercel предоставляет домен: `your-app.vercel.app`

Чтобы добавить свой домен:
1. Перейдите в Settings > Domains
2. Добавьте ваш домен
3. Обновите DNS записи согласно инструкциям Vercel

