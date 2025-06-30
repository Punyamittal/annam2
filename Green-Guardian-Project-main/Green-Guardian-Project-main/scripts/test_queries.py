#!/usr/bin/env python3
"""
Test script to simulate agent flow and API queries
"""

import os
import sys
import json
import asyncio
import httpx
from dotenv import load_dotenv

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import agents
from backend.agents.pollution_agent import PollutionAgent
from backend.agents.advice_agent import AdviceAgent
from backend.agents.memory_agent import MemoryAgent

# Import services
from backend.services.tavily_service import TavilyService
from backend.services.mem0_service import Mem0Service

# Load environment variables
load_dotenv()

# Initialize services
tavily_service = TavilyService(api_key=os.getenv("TAVILY_API_KEY"))
mem0_service = Mem0Service(api_key=os.getenv("MEM0_API_KEY"))

# Initialize agents
pollution_agent = PollutionAgent(tavily_service)
advice_agent = AdviceAgent()
memory_agent = MemoryAgent(mem0_service)

# Test locations
TEST_LOCATIONS = [
    "New York City",
    "Los Angeles",
    "Chicago"
]

async def test_pollution_agent():
    """Test the pollution agent"""
    print("\n=== Testing Pollution Agent ===\n")
    
    for location in TEST_LOCATIONS:
        print(f"Getting pollution data for {location}...")
        try:
            result = await pollution_agent.get_pollution_data(location)
            print(f"Result for {location}:")
            print(json.dumps(result, indent=2))
            print("\n---\n")
        except Exception as e:
            print(f"Error getting pollution data for {location}: {str(e)}")

async def test_advice_agent():
    """Test the advice agent"""
    print("\n=== Testing Advice Agent ===\n")
    
    # Mock environmental data
    mock_env_data = {
        "location": "Test City",
        "air_quality": {
            "aqi": 75,
            "category": "Moderate",
            "pm25": 15.2,
            "pm10": 25.6
        },
        "water_quality": {
            "status": "Good",
            "contaminants": []
        },
        "uv_index": 6.5,
        "pollen_count": {
            "overall": {
                "level": "medium",
                "value": 3.5
            }
        },
        "weather": {
            "temperature": 22.5,
            "humidity": 65
        }
    }
    
    print("Generating risk assessment...")
    try:
        risk_assessment = await advice_agent.generate_risk_assessment(mock_env_data)
        print("Risk Assessment:")
        print(json.dumps(risk_assessment, indent=2))
        print("\n---\n")
    except Exception as e:
        print(f"Error generating risk assessment: {str(e)}")
    
    print("Generating advice...")
    try:
        advice = await advice_agent.generate_advice(mock_env_data)
        print("Advice:")
        print(json.dumps(advice, indent=2))
        print("\n---\n")
    except Exception as e:
        print(f"Error generating advice: {str(e)}")
    
    print("Testing chat response...")
    try:
        messages = [
            {"role": "user", "content": "What should I do if the air quality is poor today?"}
        ]
        response = await advice_agent.generate_chat_response(
            messages=messages,
            environmental_context=json.dumps(mock_env_data)
        )
        print("Chat Response:")
        print(response)
        print("\n---\n")
    except Exception as e:
        print(f"Error generating chat response: {str(e)}")

async def test_memory_agent():
    """Test the memory agent"""
    print("\n=== Testing Memory Agent ===\n")
    
    # Test user ID
    test_user_id = "test_user_123"
    
    # Test messages
    test_messages = [
        {"role": "user", "content": "Is it safe to go running today?"},
        {"role": "assistant", "content": "Based on the current air quality, it should be safe for most people to go running today. The AQI is in the moderate range, so if you have respiratory issues, you might want to consider a shorter run or exercising indoors."}
    ]
    
    print(f"Storing context for user {test_user_id}...")
    try:
        await memory_agent.store_context(
            user_id=test_user_id,
            location="Test City",
            messages=test_messages
        )
        print("Context stored successfully")
    except Exception as e:
        print(f"Error storing context: {str(e)}")
    
    print(f"Retrieving context for user {test_user_id}...")
    try:
        context = await memory_agent.retrieve_context(test_user_id)
        print("Retrieved Context:")
        print(context)
        print("\n---\n")
    except Exception as e:
        print(f"Error retrieving context: {str(e)}")

async def test_api_endpoints():
    """Test API endpoints"""
    print("\n=== Testing API Endpoints ===\n")
    
    # API base URL
    api_base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        # Test environmental data endpoint
        print("Testing /api/environmental-data endpoint...")
        try:
            response = await client.post(
                f"{api_base_url}/api/environmental-data",
                json={"location": "New York City", "radius_km": 5.0}
            )
            print(f"Status code: {response.status_code}")
            if response.status_code == 200:
                print("Response:")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Error: {response.text}")
            print("\n---\n")
        except Exception as e:
            print(f"Error calling environmental-data endpoint: {str(e)}")
        
        # Test risk assessment endpoint
        print("Testing /api/risk-assessment endpoint...")
        try:
            response = await client.post(
                f"{api_base_url}/api/risk-assessment",
                json={"location": "New York City", "radius_km": 5.0}
            )
            print(f"Status code: {response.status_code}")
            if response.status_code == 200:
                print("Response:")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Error: {response.text}")
            print("\n---\n")
        except Exception as e:
            print(f"Error calling risk-assessment endpoint: {str(e)}")
        
        # Test chat endpoint
        print("Testing /api/chat endpoint...")
        try:
            response = await client.post(
                f"{api_base_url}/api/chat",
                json={
                    "messages": [
                        {"role": "user", "content": "What's the air quality like in New York today?"}
                    ],
                    "location": "New York City",
                    "user_id": "test_user_123"
                }
            )
            print(f"Status code: {response.status_code}")
            if response.status_code == 200:
                print("Response:")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Error: {response.text}")
            print("\n---\n")
        except Exception as e:
            print(f"Error calling chat endpoint: {str(e)}")

async def main():
    """Main function to run tests"""
    print("Starting GreenGuardian test queries...")
    
    # Uncomment the tests you want to run
    
    # Test pollution agent
    # await test_pollution_agent()
    
    # Test advice agent
    # await test_advice_agent()
    
    # Test memory agent
    # await test_memory_agent()
    
    # Test API endpoints (requires backend server to be running)
    # await test_api_endpoints()
    
    print("Test queries complete!")

if __name__ == "__main__":
    asyncio.run(main())
