# Инструкции для PowerShell

## Активация виртуального окружения в PowerShell

В PowerShell активация виртуального окружения выполняется по-другому, чем в CMD.

### Правильный способ:

```powershell
# Перейдите в директорию backend
cd backend

# Активируйте виртуальное окружение
.\venv\Scripts\Activate.ps1

# Или с полным путем
& .\venv\Scripts\Activate.ps1
```

### Если возникает ошибка "execution policy":

PowerShell может блокировать выполнение скриптов. Разрешите выполнение:

```powershell
# Для текущей сессии
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Или для текущего пользователя (постоянно)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Затем попробуйте снова:
```powershell
.\venv\Scripts\Activate.ps1
```

## Использование скриптов

### Установка (PowerShell):
```powershell
.\install.ps1
```

### Запуск (PowerShell):
```powershell
.\start.ps1
```

## Ручной запуск в PowerShell

### Backend:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

### Frontend:
```powershell
cd frontend
npm run dev
```

## Альтернатива: использование CMD из PowerShell

Если скрипты PowerShell не работают, используйте .bat файлы:

```powershell
.\install.bat
.\start.bat
```

Или запустите через cmd:
```powershell
cmd /c install.bat
cmd /c start.bat
```

