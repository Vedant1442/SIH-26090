import os
import io
import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# Use the Gemma model which is supported and fast
AI_MODEL = "google/gemma-3-27b-it"

class CatalogRequest(BaseModel):
    transcript: str

class PricingRequest(BaseModel):
    title: str
    materials: str
    category: str

from rembg import remove, new_session

# Load lightweight model for faster CPU inference (only 4MB instead of 170MB)
rembg_session = new_session("u2netp")

@router.post("/enhance")
async def enhance_image(file: UploadFile = File(...)):
    """
    Real AI Image Enhancer using rembg to remove cluttered backgrounds.
    """
    try:
        from PIL import Image, ImageEnhance
        
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGBA")
        
        # Step 1: Remove background using AI (u2net model)
        output_image = remove(input_image, session=rembg_session)
        
        # Step 2: Paste on clean white background (e-commerce standard)
        background = Image.new("RGB", output_image.size, (255, 255, 255))
        background.paste(output_image, mask=output_image.split()[3])
        output_image = background
        
        # Step 3: Auto-correct brightness and contrast
        enhancer = ImageEnhance.Brightness(output_image)
        output_image = enhancer.enhance(1.1)
        enhancer = ImageEnhance.Contrast(output_image)
        output_image = enhancer.enhance(1.2)
        enhancer = ImageEnhance.Sharpness(output_image)
        output_image = enhancer.enhance(1.3)
            
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='JPEG', quality=92)
        img_byte_arr = img_byte_arr.getvalue()
        
        return Response(content=img_byte_arr, media_type="image/jpeg")
    except ImportError:
        raise HTTPException(status_code=503, detail="rembg not installed. Run: pip install rembg pillow")
    except Exception as e:
        print(f"Error enhancing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-catalog")
async def generate_catalog(request: CatalogRequest):
    """
    Real Multilingual NLP Cataloger & Dynamic Pricing Assistant via OpenRouter.
    """
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not set in backend/.env")
    
    prompt = f"""You are an expert AI product cataloger for Indian artisan handcraft products.

An artisan described their product via voice: "{request.transcript}"

Based on this, generate a professional e-commerce product listing as a JSON object with these exact fields:
- title: Catchy English product title
- title_hindi: Same title in Hindi (unicode)
- title_telugu: Same title in Telugu (unicode)
- title_marathi: Same title in Marathi (unicode)
- category: The exact sub-category string (e.g. "Textiles › Banarasi Silk")
- materials: comma separated materials (e.g. "Silk, Zari")
- seo_description: 3-sentence professional description in English
- seo_description_hindi: Same description translated to Hindi (unicode)
- seo_description_marathi: Same description translated to Marathi (unicode)
- estimated_price: integer in INR based on artisan's words (or 1500 if not stated)
- price_reasoning: One sentence explaining why this price is fair

Return ONLY the raw JSON. No markdown, no explanation."""

    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Strip markdown code fences if the model wraps them
        if "```" in result_text:
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
        
        return json.loads(result_text.strip())
    except json.JSONDecodeError as e:
        # Return raw text as fallback
        raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {result_text}")
    except Exception as e:
        print(f"OpenRouter error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pricing")
async def get_pricing(request: PricingRequest):
    """
    Standalone Dynamic Pricing endpoint using real market analysis via AI.
    """
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not set in backend/.env")
    
    prompt = f"""You are a pricing expert for Indian handcraft products sold on e-commerce platforms like ONDC and GeM.

Product details:
- Name: {request.title}
- Materials: {request.materials}
- Category: {request.category}

Analyze the Indian handcraft market and return a JSON with:
- price_low: Conservative minimum price (integer INR)
- price_high: Maximum premium price (integer INR)
- recommended_price: Best recommended selling price (integer INR)
- confidence: "High", "Medium", or "Low"
- market_insight: A strong 1-2 sentence justification of exactly WHY this recommended_price is the sweet spot for maximizing profit while staying competitive, compared to what an artisan might typically guess.
- cost_breakdown: object with keys "materials", "labor", "overhead", "margin" as INR integers that sum to recommended_price

Return ONLY raw JSON."""

    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        
        result_text = response.choices[0].message.content.strip()
        
        if "```" in result_text:
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
        
        return json.loads(result_text.strip())
    except Exception as e:
        print(f"Pricing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    message: str
    language: str

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Multilingual assistant chatbot for artisans.
    """
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not set")
    
    system_prompt = f"""You are KalaMitr — the dedicated AI business assistant built exclusively into the Kalasangam app for Indian artisans and craftspeople.

YOUR ONLY PURPOSE is to help artisans with:
- Selling handcrafts on ONDC and GeM government marketplaces
- Pricing their craft products fairly
- Understanding documentation (Udyam, GST, PAN, Aadhaar)
- Using Kalasangam app features (voice capture, catalog, export)
- Tips on photography, product descriptions, and packaging
- Finding local craft fairs, exhibitions, and buyers

STRICT RULES — you MUST follow these with no exceptions:
1. NEVER answer questions unrelated to artisan business, crafts, ONDC, GeM, or the Kalasangam app.
2. If the user asks ANYTHING off-topic (coding, general knowledge, current events, math, science, etc.) — you MUST refuse politely and redirect.
3. When refusing, say EXACTLY: "मैं केवल कारीगरों की मदद कर सकता हूँ!" in Hindi or the equivalent in {request.language}, then explain in 1 sentence what you CAN help with.
4. Never write code, solve algorithms, answer trivia, or act as a general-purpose chatbot.
5. You are NOT ChatGPT. You are NOT a general assistant. You are KalaMitr — an artisan business specialist only.

RESPONSE FORMAT:
- Respond strictly in {request.language}
- Keep answers brief, warm, and practical — maximum 3 sentences
- No markdown, no bullet points, no code blocks
- Always end with one actionable tip or encouragement relevant to their craft business"""

    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            temperature=0.3,
            max_tokens=200
        )
        return {"response": response.choices[0].message.content.strip()}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
