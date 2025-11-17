"""
Тестовый скрипт для проверки работы backend
"""

import requests
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"

def test_health():
    """Тест health check"""
    print("🔍 Тестирование /health...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_root():
    """Тест root endpoint"""
    print("🔍 Тестирование /...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

if __name__ == "__main__":
    print("🧪 Тестирование Virtual Fitting Room API\n")
    
    try:
        test_root()
        test_health()
        print("✅ Все тесты пройдены!")
    except requests.exceptions.ConnectionError:
        print("❌ Ошибка: Backend не запущен!")
        print("Запустите: cd backend && python main.py")
    except Exception as e:
        print(f"❌ Ошибка: {e}")

