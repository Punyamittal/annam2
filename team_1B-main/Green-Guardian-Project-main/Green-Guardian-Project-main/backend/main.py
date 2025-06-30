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

# Models
class LocationQuery(BaseModel):
    location: str
    radius_km: Optional[float] = 5.0

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    location: Optional[str] = None
    user_id: Optional[str] = None
    user_type: Optional[str] = None  # "farmer", "urban_planner", "citizen", "ngo"

class EnvironmentalData(BaseModel):
    location: str
    air_quality: Dict[str, Any]
    water_quality: Optional[Dict[str, Any]]
    uv_index: Optional[float]
    pollen_count: Optional[Dict[str, Any]]
    weather: Optional[Dict[str, Any]]
    timestamp: str

class CropQuery(BaseModel):
    location: str
    season: Optional[str] = None

class PestManagementQuery(BaseModel):
    location: str
    crop_type: str

# CopilotKit Models
class CopilotMessage(BaseModel):
    role: str
    content: str

class CopilotRequest(BaseModel):
    messages: List[CopilotMessage]
    context: Optional[Dict[str, Any]] = None

class CopilotToolCall(BaseModel):
    name: str
    parameters: Dict[str, Any]

class CopilotResponse(BaseModel):
    content: str
    tool_calls: Optional[List[CopilotToolCall]] = None

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to GreenGuardian API"}

@app.post("/api/environmental-data")
async def get_environmental_data(query: LocationQuery):
    try:
        # Track with Keywords AI
        with keywords_ai.trace("get_environmental_data"):
            # Get pollution data from Tavily through the agent
            pollution_data = await pollution_agent.get_pollution_data(query.location, query.radius_km)
            
            # Get weather data
            weather_data = await weather_api.get_weather(query.location)
            
            # Combine data
            result = {
                "location": query.location,
                "air_quality": pollution_data.get("air_quality", {}),
                "water_quality": pollution_data.get("water_quality", {}),
                "uv_index": weather_data.get("uv_index"),
                "pollen_count": weather_data.get("pollen_count", {}),
                "weather": weather_data,
                "timestamp": weather_data.get("timestamp")
            }
            
            return result
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error fetching environmental data: {str(e)}")

@app.post("/api/risk-assessment")
async def get_risk_assessment(query: LocationQuery):
    try:
        # Get environmental data first
        env_data = await get_environmental_data(query)
        
        # Use advice agent to generate risk assessment
        with keywords_ai.trace("generate_risk_assessment"):
            risk_assessment = await advice_agent.generate_risk_assessment(env_data)
            
        return risk_assessment
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error generating risk assessment: {str(e)}")

@app.post("/api/advice")
async def get_advice(query: LocationQuery):
    try:
        # Get environmental data first
        env_data = await get_environmental_data(query)
        
        # Use advice agent to generate advice
        with keywords_ai.trace("generate_advice"):
            advice = await advice_agent.generate_advice(env_data)
            
        return advice
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error generating advice: {str(e)}")

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        print(f"Received chat request with message: {request.messages[-1].content if request.messages else 'No message'}")
        with keywords_ai.trace("chat_request"):
            # Check for simple greetings first
            if request.messages and len(request.messages) > 0:
                last_message = request.messages[-1]
                if last_message.role == "user":
                    user_text = last_message.content.lower().strip()
                    if user_text in ['hi', 'hello', 'hey', 'greetings', 'howdy', 'hi there', 'hello there']:
                        print("Detected greeting, sending quick response")
                        return {"response": "Hello! I'm your environmental assistant. How can I help you today? You can ask me about air quality, weather conditions, environmental risks, or farming advice."}
            
            # Store context in memory if user_id is provided
            if request.user_id and request.location:
                await memory_agent.store_context(
                    user_id=request.user_id,
                    location=request.location,
                    messages=request.messages
                )
            
            # Get environmental data if location is provided
            env_context = None
            if request.location:
                try:
                    env_data = await get_environmental_data(LocationQuery(location=request.location))
                    env_context = json.dumps(env_data)
                except Exception as e:
                    print(f"Error getting environmental data: {str(e)}")
                    # Continue without environmental data
            
            # Get previous context if user_id is provided
            prev_context = None
            if request.user_id:
                try:
                    prev_context = await memory_agent.retrieve_context(request.user_id)
                except Exception as e:
                    print(f"Error retrieving context: {str(e)}")
                    # Continue without previous context
            
            # Generate response using Tavily chat agent instead of advice agent
            try:
                print(f"Generating chat response for query: {request.messages[-1].content if request.messages else 'No message'}")
                response = await tavily_chat_agent.generate_chat_response(
                    messages=request.messages,
                    environmental_context=env_context,
                    previous_context=prev_context,
                    user_type=request.user_type
                )
                print(f"Generated response: {response[:100]}...")
                return {"response": response}
            except Exception as e:
                print(f"Error in chat response generation: {str(e)}")
                # Get the user's query
                user_query = request.messages[-1].content.lower() if request.messages and len(request.messages) > 0 else ""
                print(f"Providing topic-specific response for query: {user_query}")
                
                # Provide topic-specific fallback responses
                if "weather" in user_query or "temperature" in user_query or "climate" in user_query:
                    return {"response": "Weather and climate are key environmental factors that affect our daily lives. Weather refers to short-term atmospheric conditions like temperature, humidity, precipitation, wind speed, and air pressure in a specific place and time. Climate, on the other hand, refers to the long-term patterns of weather in a particular region. Climate change is causing more extreme weather events, rising temperatures, and shifting precipitation patterns globally."}
                
                elif "pollution" in user_query or "air quality" in user_query:
                    return {"response": "Air pollution is a major environmental concern that affects human health and ecosystems. Common air pollutants include particulate matter (PM2.5 and PM10), nitrogen dioxide (NO2), sulfur dioxide (SO2), carbon monoxide (CO), and ozone (O3). These pollutants come from sources like vehicle emissions, industrial activities, and burning fossil fuels. Poor air quality can cause respiratory issues, cardiovascular problems, and other health concerns, especially for vulnerable populations."}
                
                elif "water" in user_query:
                    return {"response": "Water quality is essential for human health and ecosystem functioning. Water pollution can come from various sources, including industrial discharge, agricultural runoff, and urban waste. Key water quality parameters include pH, dissolved oxygen, turbidity, and the presence of contaminants like heavy metals, pesticides, and bacteria. Clean water is necessary for drinking, agriculture, and supporting aquatic life."}
                
                elif "plant" in user_query or "garden" in user_query or "farming" in user_query or "agriculture" in user_query:
                    return {"response": "Plants are affected by various environmental factors including temperature, precipitation, soil quality, and sunlight. Climate change is altering growing seasons and creating new challenges for agriculture and gardening. Sustainable farming practices like crop rotation, reduced tillage, and integrated pest management can help mitigate environmental impacts while maintaining productivity."}
                
                elif "recycling" in user_query or "waste" in user_query or "plastic" in user_query:
                    return {"response": "Waste management and recycling are important for reducing environmental impact. Recycling helps conserve resources, reduce landfill waste, and lower greenhouse gas emissions. Materials commonly recycled include paper, glass, metals, and certain plastics. Reducing consumption, reusing items, and properly disposing of waste are also key practices for environmental sustainability."}
                
                else:
                    return {"response": "Environmental science covers many interconnected topics including air and water quality, climate patterns, biodiversity, ecosystem health, and human impacts on natural systems. Environmental conditions affect human health, agriculture, infrastructure, and natural habitats. Sustainable practices and policies aim to balance human needs with environmental protection for current and future generations."}
    except Exception as e:
        keywords_ai.log_error(str(e))
        print(f"Chat request error: {str(e)}")
        
        try:
            # Get the user's query for topic-specific fallback responses
            user_query = request.messages[-1].content.lower() if request.messages and len(request.messages) > 0 else ""
            print(f"Providing fallback response for query: {user_query}")
            
            # Provide topic-specific fallback responses
            if "weather" in user_query or "temperature" in user_query or "climate" in user_query:
                return {"response": "Weather and climate are key environmental factors that affect our daily lives. Weather refers to short-term atmospheric conditions like temperature, humidity, precipitation, wind speed, and air pressure in a specific place and time. Climate, on the other hand, refers to the long-term patterns of weather in a particular region. Climate change is causing more extreme weather events, rising temperatures, and shifting precipitation patterns globally."}
            
            elif "pollution" in user_query or "air quality" in user_query:
                return {"response": "Air pollution is a major environmental concern that affects human health and ecosystems. Common air pollutants include particulate matter (PM2.5 and PM10), nitrogen dioxide (NO2), sulfur dioxide (SO2), carbon monoxide (CO), and ozone (O3). These pollutants come from sources like vehicle emissions, industrial activities, and burning fossil fuels. Poor air quality can cause respiratory issues, cardiovascular problems, and other health concerns, especially for vulnerable populations."}
            
            elif "water" in user_query:
                return {"response": "Water quality is essential for human health and ecosystem functioning. Water pollution can come from various sources, including industrial discharge, agricultural runoff, and urban waste. Key water quality parameters include pH, dissolved oxygen, turbidity, and the presence of contaminants like heavy metals, pesticides, and bacteria. Clean water is necessary for drinking, agriculture, and supporting aquatic life."}
            
            elif "plant" in user_query or "garden" in user_query or "farming" in user_query or "agriculture" in user_query:
                return {"response": "Plants are affected by various environmental factors including temperature, precipitation, soil quality, and sunlight. Climate change is altering growing seasons and creating new challenges for agriculture and gardening. Sustainable farming practices like crop rotation, reduced tillage, and integrated pest management can help mitigate environmental impacts while maintaining productivity."}
            
            elif "recycling" in user_query or "waste" in user_query or "plastic" in user_query:
                return {"response": "Waste management and recycling are important for reducing environmental impact. Recycling helps conserve resources, reduce landfill waste, and lower greenhouse gas emissions. Materials commonly recycled include paper, glass, metals, and certain plastics. Reducing consumption, reusing items, and properly disposing of waste are also key practices for environmental sustainability."}
            
            else:
                return {"response": "Environmental science covers many interconnected topics including air and water quality, climate patterns, biodiversity, ecosystem health, and human impacts on natural systems. Environmental conditions affect human health, agriculture, infrastructure, and natural habitats. Sustainable practices and policies aim to balance human needs with environmental protection for current and future generations."}
        except Exception as nested_e:
            print(f"Error in fallback response: {str(nested_e)}")
            return {"response": "I'm sorry, I encountered an error while processing your request. Please try again with a different question about environmental topics."}

# CopilotKit endpoint
@app.post("/api/copilot")
async def copilot_endpoint(request: CopilotRequest):
    try:
        print(f"Received CopilotKit request with message: {request.messages[-1].content if request.messages else 'No message'}")
        
        # Extract user message
        user_message = request.messages[-1].content if request.messages and request.messages[-1].role == "user" else ""
        
        # Extract location from context if available
        location = None
        if request.context and "userLocation" in request.context:
            try:
                location_data = json.loads(request.context["userLocation"])
                if isinstance(location_data, dict) and "lat" in location_data and "lng" in location_data:
                    location = f"{location_data['lat']},{location_data['lng']}"
            except:
                pass
        
        # Create ChatMessage objects for the existing chat endpoint
        chat_messages = [ChatMessage(role=msg.role, content=msg.content) for msg in request.messages]
        
        # Create a chat request
        chat_req = ChatRequest(
            messages=chat_messages,
            location=location,
            user_type="citizen"  # Default user type
        )
        
        # Use the existing chat endpoint logic
        chat_response = await chat(chat_req)
        
        # Format response for CopilotKit
        response = CopilotResponse(
            content=chat_response["response"],
            tool_calls=[]  # No tool calls for now
        )
        
        return response
    except Exception as e:
        print(f"CopilotKit request error: {str(e)}")
        return CopilotResponse(
            content="I'm sorry, I encountered an error while processing your request. Please try again later.",
            tool_calls=[]
        )
@app.post("/api/farming/crop-recommendations")
async def get_crop_recommendations(query: CropQuery):
    try:
        with keywords_ai.trace("get_crop_recommendations"):
            recommendations = await farming_agent.get_crop_recommendations(
                location=query.location,
                season=query.season
            )
            return recommendations
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error getting crop recommendations: {str(e)}")

@app.post("/api/farming/irrigation-advice")
async def get_irrigation_advice(query: LocationQuery):
    try:
        # Get environmental data first
        env_data = await get_environmental_data(query)
        
        # Use farming agent to generate irrigation advice
        with keywords_ai.trace("generate_irrigation_advice"):
            advice = await farming_agent.get_irrigation_advice(
                location=query.location,
                environmental_data=env_data
            )
            
        return advice
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error generating irrigation advice: {str(e)}")

@app.post("/api/farming/pest-management")
async def get_pest_management(query: PestManagementQuery):
    try:
        with keywords_ai.trace("get_pest_management"):
            advice = await farming_agent.get_pest_management_advice(
                location=query.location,
                crop_type=query.crop_type
            )
            return advice
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error getting pest management advice: {str(e)}")

# Urban planning endpoints
@app.post("/api/urban-planning/risk-zones")
async def get_risk_zone_analysis(query: LocationQuery):
    try:
        # Get environmental data first
        env_data = await get_environmental_data(query)
        
        # Use urban planning agent to analyze risk zones
        with keywords_ai.trace("analyze_risk_zones"):
            analysis = await urban_planning_agent.get_risk_zone_analysis(
                location=query.location,
                environmental_data=env_data
            )
            
        return analysis
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error analyzing risk zones: {str(e)}")

@app.post("/api/urban-planning/green-infrastructure")
async def get_green_infrastructure(query: LocationQuery):
    try:
        with keywords_ai.trace("get_green_infrastructure"):
            recommendations = await urban_planning_agent.get_green_infrastructure_recommendations(
                location=query.location
            )
            return recommendations
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error getting green infrastructure recommendations: {str(e)}")

@app.post("/api/urban-planning/pollution-trends")
async def analyze_pollution_trends(query: LocationQuery):
    try:
        # Get historical data from memory agent
        historical_data = await memory_agent.retrieve_environmental_data(query.location)
        
        if not historical_data:
            return {
                "error": "Insufficient historical data for trend analysis",
                "location": query.location,
                "recommendation": "Continue collecting data for this location to enable trend analysis."
            }
        
        # Use urban planning agent to analyze pollution trends
        with keywords_ai.trace("analyze_pollution_trends"):
            analysis = await urban_planning_agent.analyze_pollution_trends(
                location=query.location,
                historical_data=historical_data
            )
            
        return analysis
    except Exception as e:
        keywords_ai.log_error(str(e))
        raise HTTPException(status_code=500, detail=f"Error analyzing pollution trends: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
