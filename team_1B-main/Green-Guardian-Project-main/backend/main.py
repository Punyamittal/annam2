from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import os
import json
from dotenv import load_dotenv

# Import services
from services.tavily_service import TavilyService
from services.mem0_service import Mem0Service
from services.appwrite_service import AppwriteService
from services.weather_api import WeatherAPI
from services.keywordsai_wrapper import KeywordsAIWrapper

# Import agents
from agents.pollution_agent import PollutionAgent
from agents.advice_agent import AdviceAgent
from agents.memory_agent import MemoryAgent
from agents.farming_agent_new import FarmingAgent
from agents.urban_planning_agent import UrbanPlanningAgent
from agents.tavily_chat_agent import TavilyChatAgent

# Import routers
from routers.plant_health import router as plant_health_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="GreenGuardian API",
    description="API for environmental monitoring and analysis",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
tavily_service = TavilyService(api_key=os.getenv("TAVILY_API_KEY"))
mem0_service = Mem0Service(api_key=os.getenv("MEM0_API_KEY"))
appwrite_service = AppwriteService(
    endpoint=os.getenv("APPWRITE_ENDPOINT"),
    project_id=os.getenv("APPWRITE_PROJECT_ID"),
    api_key=os.getenv("APPWRITE_API_KEY")
)
weather_api = WeatherAPI(api_key=os.getenv("WEATHER_API_KEY"))
keywords_ai = KeywordsAIWrapper(api_key=os.getenv("KEYWORDS_AI_API_KEY"))

# Initialize agents
pollution_agent = PollutionAgent(tavily_service)
advice_agent = AdviceAgent()
memory_agent = MemoryAgent(mem0_service)
farming_agent = FarmingAgent(tavily_service)
urban_planning_agent = UrbanPlanningAgent(tavily_service)
tavily_chat_agent = TavilyChatAgent(tavily_service)

# Include routers
app.include_router(plant_health_router, prefix="/api/plant-health", tags=["plant-health"])

# ... existing code ... 