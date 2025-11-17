# Virtual Fitting Room - Установка (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Virtual Fitting Room - Установка" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка Python
Write-Host "[1/4] Проверка Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python найден: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ОШИБКА: Python не найден!" -ForegroundColor Red
    Write-Host "Установите Python 3.9+ с https://python.org" -ForegroundColor Red
    exit 1
}

# Установка Backend зависимостей
Write-Host "[2/4] Установка Backend зависимостей..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "Создание виртуального окружения..." -ForegroundColor Yellow
    python -m venv venv
}

# Активация виртуального окружения в PowerShell
& .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
deactivate
Set-Location ..

# Проверка Node.js
Write-Host "[3/4] Проверка Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ОШИБКА: Node.js не найден!" -ForegroundColor Red
    Write-Host "Установите Node.js 18+ с https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Установка Frontend зависимостей
Write-Host "[4/4] Установка Frontend зависимостей..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Установка завершена!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "ВАЖНО: Создайте файл backend/.env с вашим API ключом:" -ForegroundColor Yellow
Write-Host "GEMINI_API_KEY=ваш_ключ_здесь" -ForegroundColor Yellow
Write-Host ""
Write-Host "Получить ключ: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для запуска используйте: .\start.ps1" -ForegroundColor Cyan
Write-Host ""

