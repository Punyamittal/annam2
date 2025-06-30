from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

class PlantHealthRequest(BaseModel):
    image_data: str

@router.post("/analyze")
async def analyze_plant_health(request: PlantHealthRequest) -> Dict[str, Any]:
    """
    Analyze plant health from an image using Gemini Vision API
    
    Args:
        request: PlantHealthRequest containing base64 encoded image data
        
    Returns:
        Dictionary containing plant health analysis results
    """
    try:
        analysis_result = await gemini_service.analyze_plant_health(request.image_data)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 