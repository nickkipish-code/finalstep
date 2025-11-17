# Backend - Virtual Fitting Room API

FastAPI backend для виртуальной примерки одежды с использованием Google Gemini 2.5 Flash Image.

## Установка

1. Создайте виртуальное окружение:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

2. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

3. Создайте файл `.env`:
   ```
   GEMINI_API_KEY=ваш_ключ_здесь
   ```

## Запуск

```bash
python main.py
```

API будет доступен на http://localhost:8000

## Endpoints

- `GET /` - Health check
- `GET /health` - Детальная проверка
- `POST /api/try-on/text` - Text to Image генерация
- `POST /api/try-on/image` - Image to Image генерация

## Тестирование

```bash
python backend_test.py
```

## Документация API

После запуска доступна автоматическая документация:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

