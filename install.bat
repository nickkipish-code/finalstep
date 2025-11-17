@echo off
echo ========================================
echo Virtual Fitting Room - Установка
echo ========================================
echo.

echo [1/4] Проверка Python...
python --version
if errorlevel 1 (
    echo ОШИБКА: Python не найден!
    echo Установите Python 3.9+ с https://python.org
    pause
    exit /b 1
)

echo [2/4] Установка Backend зависимостей...
cd backend
if not exist venv (
    echo Создание виртуального окружения...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo [3/4] Проверка Node.js...
node --version
if errorlevel 1 (
    echo ОШИБКА: Node.js не найден!
    echo Установите Node.js 18+ с https://nodejs.org
    pause
    exit /b 1
)

echo [4/4] Установка Frontend зависимостей...
cd frontend
call npm install
cd ..

echo.
echo ========================================
echo Установка завершена!
echo ========================================
echo.
echo ВАЖНО: Создайте файл backend/.env с вашим API ключом:
echo GEMINI_API_KEY=ваш_ключ_здесь
echo.
echo Получить ключ: https://aistudio.google.com/app/apikey
echo.
echo Для запуска используйте: start.bat
echo.
pause

