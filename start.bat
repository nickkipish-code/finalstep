@echo off
echo ========================================
echo Virtual Fitting Room - Запуск проекта
echo ========================================
echo.

echo [1/2] Запуск Backend...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python main.py"

timeout /t 3 /nobreak >nul

echo [2/2] Запуск Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Проект запущен!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Нажмите любую клавишу для выхода...
pause >nul

