"""
Virtual Fitting Room API - Gemini 2.5 Flash Image
Backend для виртуальной примерки одежды с использованием Google Gemini AI
"""

import io
import os
import logging
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import google.generativeai as genai

# Загрузка переменных окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация FastAPI
app = FastAPI(
    title="Virtual Fitting Room API - Gemini 2.5 Flash Image",
    description="API для виртуальной примерки одежды с использованием Gemini 2.5 Flash Image",
    version="1.0.0"
)

# CORS для локальной разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Получение API ключа
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    logger.warning("⚠️ GEMINI_API_KEY не найден в .env файле!")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("✅ Gemini API настроен")

# Инициализация модели
try:
    model = genai.GenerativeModel('gemini-2.5-flash-image')
    logger.info("✅ Модель gemini-2.5-flash-image загружена")
except Exception as e:
    logger.error(f"❌ Ошибка загрузки модели: {e}")
    model = None


def add_watermark(image: Image.Image, text: str = "Virtual Fitting Room") -> Image.Image:
    """Добавляет watermark к изображению"""
    from PIL import ImageDraw, ImageFont
    
    img = image.copy()
    draw = ImageDraw.Draw(img)
    
    try:
        # Попытка использовать системный шрифт
        font = ImageFont.truetype("arial.ttf", 20)
    except:
        font = ImageFont.load_default()
    
    # Полупрозрачный текст внизу справа
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    position = (img.width - text_width - 10, img.height - text_height - 10)
    draw.text(position, text, fill=(255, 255, 255, 180), font=font)
    
    return img


async def generate_with_gemini(
    person_image: Image.Image,
    clothing_description: Optional[str] = None,
    clothing_image: Optional[Image.Image] = None
) -> Image.Image:
    """
    Генерирует изображение человека в одежде с использованием Gemini 2.5 Flash Image
    
    Args:
        person_image: Изображение человека
        clothing_description: Текстовое описание одежды
        clothing_image: Изображение одежды (опционально)
    
    Returns:
        PIL Image с результатом
    """
    if not model:
        raise HTTPException(status_code=500, detail="Gemini модель не инициализирована")
    
    try:
        # Конвертация изображения человека в bytes
        img_byte_arr = io.BytesIO()
        person_image.save(img_byte_arr, format='PNG')
        person_bytes = img_byte_arr.getvalue()
        
        # Создание image_part для человека
        person_part = {
            'mime_type': 'image/png',
            'data': person_bytes
        }
        
        # Формирование промпта
        if clothing_description:
            prompt = f"""You are an expert AI virtual fitting room assistant.

Task: Transform this person's image to show them wearing: {clothing_description}

Requirements:
- Keep the person's face, body shape, pose, and proportions EXACTLY the same
- Add the described clothing naturally fitting their body
- Maintain realistic lighting, shadows, and fabric physics
- Keep the original background
- Ensure the clothing looks professional and realistic
- Match the style and colors from the description

Generate a photorealistic image showing the person wearing the described clothing."""
        else:
            prompt = """You are an expert AI virtual fitting room assistant.

Task: Transform this person's image to show them wearing the clothing from the provided image.

Requirements:
- Keep the person's face, body shape, pose, and proportions EXACTLY the same
- Transfer the clothing from the clothing image to the person naturally
- Maintain realistic lighting, shadows, and fabric physics
- Keep the original background
- Ensure the clothing looks professional and realistic
- Match the style and colors from the clothing image

Generate a photorealistic image showing the person wearing the clothing."""
        
        # Подготовка контента для Gemini
        content_parts = [person_part]
        
        if clothing_image:
            # Конвертация изображения одежды в bytes
            clothing_byte_arr = io.BytesIO()
            clothing_image.save(clothing_byte_arr, format='PNG')
            clothing_bytes = clothing_byte_arr.getvalue()
            
            clothing_part = {
                'mime_type': 'image/png',
                'data': clothing_bytes
            }
            content_parts.append(clothing_part)
        
        content_parts.append(prompt)
        
        # Отправка запроса в Gemini
        logger.info("🔄 Отправка запроса в Gemini API...")
        response = model.generate_content(content_parts)
        
        # Извлечение изображения из ответа
        if hasattr(response, 'parts'):
            for part in response.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    image_data = part.inline_data.data
                    result_image = Image.open(io.BytesIO(image_data))
                    logger.info("✅ Изображение получено от Gemini")
                    return result_image
        
        # Fallback: возврат оригинала с watermark
        logger.warning("⚠️ Gemini не вернул изображение, возвращаем оригинал с watermark")
        return add_watermark(person_image, "Original - No AI result")
        
    except Exception as e:
        logger.error(f"❌ Ошибка генерации: {e}")
        # Fallback: возврат оригинала с watermark
        return add_watermark(person_image, f"Error: {str(e)[:30]}")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Virtual Fitting Room API",
        "status": "running",
        "engine": "Gemini 2.5 Flash Image",
        "model": "gemini-2.5-flash-image",
        "api_ready": model is not None
    }


@app.get("/health")
async def health():
    """Детальная проверка здоровья API"""
    return {
        "status": "healthy",
        "gemini_ready": model is not None,
        "model": "gemini-2.5-flash-image"
    }


@app.post("/api/try-on/text")
async def try_on_text(
    person_image: UploadFile = File(...),
    clothing_description: str = Form(...),
    strength: Optional[float] = Form(0.75)
):
    """
    Text to Image: Генерация примерки по текстовому описанию
    
    Args:
        person_image: Фото человека
        clothing_description: Описание одежды
        strength: Сила применения (для совместимости, не используется)
    
    Returns:
        PNG изображение
    """
    try:
        # Чтение и конвертация изображения человека
        image_data = await person_image.read()
        person_img = Image.open(io.BytesIO(image_data))
        
        # Конвертация в RGB если нужно
        if person_img.mode != 'RGB':
            person_img = person_img.convert('RGB')
        
        logger.info(f"📸 Получено изображение человека: {person_image.filename}")
        logger.info(f"📝 Описание одежды: {clothing_description}")
        
        # Генерация результата
        result_image = await generate_with_gemini(
            person_image=person_img,
            clothing_description=clothing_description
        )
        
        # Конвертация результата в PNG bytes
        output = io.BytesIO()
        result_image.save(output, format='PNG')
        output.seek(0)
        
        return StreamingResponse(
            io.BytesIO(output.read()),
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=result.png"}
        )
        
    except Exception as e:
        logger.error(f"❌ Ошибка обработки запроса: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/try-on/image")
async def try_on_image(
    person_image: UploadFile = File(...),
    clothing_image: UploadFile = File(...),
    description: Optional[str] = Form(None),
    strength: Optional[float] = Form(0.75)
):
    """
    Image to Image: Генерация примерки по фото одежды
    
    Args:
        person_image: Фото человека
        clothing_image: Фото одежды
        description: Дополнительное описание (опционально)
        strength: Сила применения (для совместимости, не используется)
    
    Returns:
        PNG изображение
    """
    try:
        # Чтение и конвертация изображения человека
        person_data = await person_image.read()
        person_img = Image.open(io.BytesIO(person_data))
        
        # Чтение и конвертация изображения одежды
        clothing_data = await clothing_image.read()
        clothing_img = Image.open(io.BytesIO(clothing_data))
        
        # Конвертация в RGB если нужно
        if person_img.mode != 'RGB':
            person_img = person_img.convert('RGB')
        if clothing_img.mode != 'RGB':
            clothing_img = clothing_img.convert('RGB')
        
        logger.info(f"📸 Получено изображение человека: {person_image.filename}")
        logger.info(f"👔 Получено изображение одежды: {clothing_image.filename}")
        if description:
            logger.info(f"📝 Дополнительное описание: {description}")
        
        # Формирование описания
        clothing_description = description if description else "the clothing from the provided image"
        
        # Генерация результата
        result_image = await generate_with_gemini(
            person_image=person_img,
            clothing_description=clothing_description,
            clothing_image=clothing_img
        )
        
        # Конвертация результата в PNG bytes
        output = io.BytesIO()
        result_image.save(output, format='PNG')
        output.seek(0)
        
        return StreamingResponse(
            io.BytesIO(output.read()),
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=result.png"}
        )
        
    except Exception as e:
        logger.error(f"❌ Ошибка обработки запроса: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

