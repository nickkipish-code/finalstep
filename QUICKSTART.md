# ⚡ Краткая инструкция

## Установка

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## Настройка

Создайте `backend/.env`:
```
GEMINI_API_KEY=ваш_ключ
```

Получить ключ: https://aistudio.google.com/app/apikey

## Запуск

```bash
# Terminal 1
cd backend && venv\Scripts\activate && python main.py

# Terminal 2
cd frontend && npm run dev
```

Откройте: http://localhost:3000

## Использование

1. Нажмите "Начать примерку"
2. Загрузите фото человека
3. Выберите режим:
   - **Фото + Текст**: Опишите одежду
   - **Фото + Фото**: Загрузите фото одежды
4. Нажмите "Примерить"
5. Скачайте результат!

---

Подробнее: [README.md](./README.md)

