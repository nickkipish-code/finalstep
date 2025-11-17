# 🚀 Пошаговая инструкция по деплою на Vercel

## ✅ Проект успешно синхронизирован с GitHub!

Репозиторий: https://github.com/nickkipish-code/finalstep

---

## 📋 Что нужно для деплоя

### 1. Подготовка переменных окружения

Вам понадобятся следующие ключи:

#### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - найдите в Settings > API вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - там же
- `SUPABASE_SERVICE_ROLE_KEY` - там же (НЕ публикуйте этот ключ!)

#### Google Gemini
- `GOOGLE_GEMINI_API_KEY` - получите на https://makersuite.google.com/app/apikey

#### NextAuth (Google OAuth)
- `AUTH_SECRET` - сгенерируйте командой: `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` - Google OAuth Client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth Client Secret
- `NEXTAUTH_URL` - будет URL вашего Vercel приложения

---

## 🎯 Деплой через Vercel Dashboard (Самый простой способ)

### Шаг 1: Создание проекта на Vercel

1. Перейдите на **https://vercel.com**
2. Нажмите **"Add New..."** → **"Project"**
3. Найдите и выберите репозиторий **`finalstep`**
4. Нажмите **"Import"**

### Шаг 2: Настройка проекта

1. **Framework Preset**: Next.js (определится автоматически)
2. **Root Directory**: `v.2.0` (ВАЖНО!)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### Шаг 3: Добавление переменных окружения

В разделе **"Environment Variables"** добавьте:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GEMINI_API_KEY=your_gemini_key
AUTH_SECRET=your_generated_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

⚠️ **ВАЖНО**: Сначала укажите временный URL для `NEXTAUTH_URL`, после деплоя обновите его на реальный URL вашего приложения.

### Шаг 4: Деплой

Нажмите **"Deploy"** и дождитесь завершения сборки (обычно 2-3 минуты).

---

## 🔧 Настройка после деплоя

### 1. Обновление NEXTAUTH_URL

После успешного деплоя:
1. Скопируйте URL вашего приложения (например: `https://finalstep.vercel.app`)
2. В Vercel Dashboard → Settings → Environment Variables
3. Обновите значение `NEXTAUTH_URL` на ваш реальный URL
4. Сделайте редеплой (Deploy → Redeploy)

### 2. Настройка Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com)
2. Выберите ваш проект
3. APIs & Services → Credentials
4. Найдите ваш OAuth 2.0 Client ID
5. Добавьте в **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

### 3. Настройка Supabase

1. Откройте ваш проект в [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings → Authentication
3. **Site URL**: Укажите `https://your-app.vercel.app`
4. **Redirect URLs**: Добавьте:
   ```
   https://your-app.vercel.app/**
   https://your-app.vercel.app/auth/callback
   ```

---

## 🔄 Автоматический деплой

После настройки Vercel будет автоматически деплоить:

- **Production (main)**: При каждом push в ветку `main`
- **Preview**: При создании Pull Request

---

## 📊 Мониторинг и отладка

### Просмотр логов
1. Vercel Dashboard → ваш проект
2. Deployments → выберите деплой
3. Runtime Logs

### Просмотр аналитики
1. Vercel Dashboard → ваш проект
2. Analytics

### Типичные проблемы

#### Build Failed
- Проверьте переменные окружения
- Убедитесь, что Root Directory указан как `v.2.0`
- Проверьте логи сборки

#### OAuth Error
- Проверьте Authorized redirect URIs в Google Cloud Console
- Проверьте значение `NEXTAUTH_URL`

#### Supabase Connection Error
- Проверьте правильность ключей Supabase
- Убедитесь, что ваш Vercel URL добавлен в Supabase Redirect URLs

---

## 🎨 Кастомный домен (опционально)

1. Vercel Dashboard → Settings → Domains
2. Add Domain
3. Введите ваш домен
4. Следуйте инструкциям по настройке DNS

**После добавления домена обновите:**
- `NEXTAUTH_URL` на новый домен
- Google OAuth Redirect URIs
- Supabase Site URL и Redirect URLs

---

## 📝 Полезные команды

### Локальный деплой с Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой на Preview
vercel

# Деплой на Production
vercel --prod
```

### Проверка переменных окружения

```bash
vercel env ls
```

### Просмотр логов

```bash
vercel logs
```

---

## ✨ Готово!

Ваше приложение теперь развернуто на Vercel и доступно по адресу:
**https://your-app.vercel.app**

При каждом push в `main` ветку будет автоматически происходить редеплой.

---

## 🆘 Нужна помощь?

- [Документация Vercel](https://vercel.com/docs)
- [Документация Next.js](https://nextjs.org/docs)
- [Документация Supabase](https://supabase.com/docs)
- [Документация NextAuth.js](https://next-auth.js.org)

