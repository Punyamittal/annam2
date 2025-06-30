#!/usr/bin/env python3
"""
Seed script to populate the GreenGuardian database with mock data
"""

import os
import sys
import json
import random
import time
from datetime import datetime, timedelta
import httpx
from dotenv import load_dotenv

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import services
from backend.services.appwrite_service import AppwriteService

# Load environment variables
load_dotenv()

# Initialize Appwrite service
appwrite_service = AppwriteService(
    endpoint=os.getenv("APPWRITE_ENDPOINT"),
    project_id=os.getenv("APPWRITE_PROJECT_ID"),
    api_key=os.getenv("APPWRITE_API_KEY")
)

# Sample locations
LOCATIONS = [
    {"name": "New York City", "lat": 40.7128, "lon": -74.0060},
    {"name": "Los Angeles", "lat": 34.0522, "lon": -118.2437},
    {"name": "Chicago", "lat": 41.8781, "lon": -87.6298},
    {"name": "Houston", "lat": 29.7604, "lon": -95.3698},
    {"name": "Phoenix", "lat": 33.4484, "lon": -112.0740},
    {"name": "Philadelphia", "lat": 39.9526, "lon": -75.1652},
    {"name": "San Antonio", "lat": 29.4241, "lon": -98.4936},
    {"name": "San Diego", "lat": 32.7157, "lon": -117.1611},
    {"name": "Dallas", "lat": 32.7767, "lon": -96.7970},
    {"name": "San Francisco", "lat": 37.7749, "lon": -122.4194}
]

# AQI categories
AQI_CATEGORIES = [
    {"range": (0, 50), "category": "Good", "color": "#00e400"},
    {"range": (51, 100), "category": "Moderate", "color": "#ffff00"},
    {"range": (101, 150), "category": "Unhealthy for Sensitive Groups", "color": "#ff7e00"},
    {"range": (151, 200), "category": "Unhealthy", "color": "#ff0000"},
    {"range": (201, 300), "category": "Very Unhealthy", "color": "#99004c"},
    {"range": (301, 500), "category": "Hazardous", "color": "#7e0023"}
]

def get_aqi_category(aqi):
    """Get AQI category based on AQI value"""
    for category in AQI_CATEGORIES:
        if category["range"][0] <= aqi <= category["range"][1]:
            return category["category"]
    return "Unknown"

def generate_air_quality():
    """Generate random air quality data"""
    aqi = random.randint(0, 300)
    return {
        "aqi": aqi,
        "category": get_aqi_category(aqi),
        "pm25": round(random.uniform(0, 150), 1),
        "pm10": round(random.uniform(0, 200), 1),
        "o3": round(random.uniform(0, 100), 1),
        "no2": round(random.uniform(0, 100), 1),
        "so2": round(random.uniform(0, 100), 1),
        "co": round(random.uniform(0, 15), 1)
    }

def generate_water_quality():
    """Generate random water quality data"""
    statuses = ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
    contaminants = [
        {"name": "Lead", "value": round(random.uniform(0, 15), 2), "unit": "ppb"},
        {"name": "Mercury", "value": round(random.uniform(0, 2), 3), "unit": "ppb"},
        {"name": "Arsenic", "value": round(random.uniform(0, 10), 2), "unit": "ppb"},
        {"name": "Nitrates", "value": round(random.uniform(0, 10), 1), "unit": "ppm"},
        {"name": "E. coli", "value": random.randint(0, 1), "unit": "present/absent"},
        {"name": "Chlorine", "value": round(random.uniform(0, 4), 1), "unit": "ppm"}
    ]
    
    # Randomly select some contaminants
    selected_contaminants = random.sample(contaminants, random.randint(2, len(contaminants)))
    
    return {
        "status": random.choice(statuses),
        "ph": round(random.uniform(6.0, 8.5), 1),
        "turbidity": round(random.uniform(0, 5), 2),
        "dissolved_oxygen": round(random.uniform(4, 12), 1),
        "contaminants": selected_contaminants
    }

def generate_pollen_count():
    """Generate random pollen count data"""
    levels = ["low", "medium", "high", "very high"]
    
    tree_level = random.choice(levels)
    grass_level = random.choice(levels)
    weed_level = random.choice(levels)
    mold_level = random.choice(levels)
    
    # Map level to numeric value
    level_to_value = {
        "low": random.uniform(0, 2.5),
        "medium": random.uniform(2.5, 5),
        "high": random.uniform(5, 7.5),
        "very high": random.uniform(7.5, 10)
    }
    
    # Determine overall level
    level_weights = {"low": 1, "medium": 2, "high": 3, "very high": 4}
    levels_list = [tree_level, grass_level, weed_level, mold_level]
    avg_weight = sum(level_weights[level] for level in levels_list) / len(levels_list)
    
    if avg_weight < 1.5:
        overall_level = "low"
    elif avg_weight < 2.5:
        overall_level = "medium"
    elif avg_weight < 3.5:
        overall_level = "high"
    else:
        overall_level = "very high"
    
    return {
        "tree_pollen": {
            "level": tree_level,
            "value": round(level_to_value[tree_level], 1)
        },
        "grass_pollen": {
            "level": grass_level,
            "value": round(level_to_value[grass_level], 1)
        },
        "weed_pollen": {
            "level": weed_level,
            "value": round(level_to_value[weed_level], 1)
        },
        "mold": {
            "level": mold_level,
            "value": round(level_to_value[mold_level], 1)
        },
        "overall": {
            "level": overall_level,
            "value": round(level_to_value[overall_level], 1)
        }
    }

def generate_weather(location):
    """Generate random weather data"""
    weather_descriptions = [
        "Clear sky", "Few clouds", "Scattered clouds", "Broken clouds", 
        "Shower rain", "Rain", "Thunderstorm", "Snow", "Mist"
    ]
    
    # Adjust temperature based on latitude (rough approximation)
    base_temp = 25 - abs(location["lat"] - 30) / 3
    
    return {
        "temperature": round(base_temp + random.uniform(-5, 5), 1),
        "humidity": random.randint(30, 90),
        "wind_speed": round(random.uniform(0, 15), 1),
        "wind_direction": random.randint(0, 359),
        "pressure": random.randint(990, 1030),
        "description": random.choice(weather_descriptions),
        "icon": "01d"  # Default icon
    }

def generate_region_data(location):
    """Generate environmental data for a region"""
    air_quality = generate_air_quality()
    water_quality = generate_water_quality()
    uv_index = round(random.uniform(0, 11), 1)
    pollen_count = generate_pollen_count()
    weather = generate_weather(location)
    
    return {
        "name": location["name"],
        "lat": location["lat"],
        "lon": location["lon"],
        "air_quality": air_quality,
        "water_quality": water_quality,
        "uv_index": uv_index,
        "pollen_count": pollen_count,
        "weather": weather,
        "timestamp": datetime.now().isoformat(),
        "sources": ["OpenWeather API", "EPA AirNow", "Local monitoring stations"],
        "data_confidence": random.choice(["High", "Medium", "Low"])
    }

def generate_risk_assessment(region_data):
    """Generate risk assessment based on environmental data"""
    air_quality = region_data["air_quality"]
    uv_index = region_data["uv_index"]
    pollen_count = region_data["pollen_count"]
    
    # Determine overall risk level
    risk_factors = []
    
    # Air quality risk
    if air_quality["aqi"] <= 50:
        air_risk = "low"
    elif air_quality["aqi"] <= 100:
        air_risk = "medium"
    else:
        air_risk = "high"
    risk_factors.append(air_risk)
    
    # UV risk
    if uv_index <= 2:
        uv_risk = "low"
    elif uv_index <= 5:
        uv_risk = "medium"
    else:
        uv_risk = "high"
    risk_factors.append(uv_risk)
    
    # Pollen risk
    pollen_risk = "medium" if pollen_count["overall"]["level"] in ["medium", "high"] else "low"
    risk_factors.append(pollen_risk)
    
    # Count risk levels
    risk_counts = {"low": 0, "medium": 0, "high": 0}
    for risk in risk_factors:
        risk_counts[risk] += 1
    
    # Determine overall risk
    if risk_counts["high"] >= 1:
        overall_risk = "high"
    elif risk_counts["medium"] >= 2:
        overall_risk = "medium"
    else:
        overall_risk = "low"
    
    # Generate specific risks
    specific_risks = [
        {
            "category": "Air Quality",
            "level": air_risk,
            "description": f"Air quality is {air_quality['category']} with AQI of {air_quality['aqi']}.",
            "affected_groups": ["Children", "Elderly", "People with respiratory conditions"]
        },
        {
            "category": "UV Exposure",
            "level": uv_risk,
            "description": f"UV index is {uv_index}, which poses a {uv_risk} risk of harm from sun exposure.",
            "affected_groups": ["All outdoor workers", "Children", "Fair-skinned individuals"]
        },
        {
            "category": "Pollen",
            "level": pollen_risk,
            "description": f"Pollen levels are {pollen_count['overall']['level']}.",
            "affected_groups": ["People with allergies", "Asthma sufferers"]
        }
    ]
    
    # Generate trend
    trend_directions = ["improving", "stable", "worsening"]
    trend = {
        "direction": random.choice(trend_directions),
        "description": f"Environmental conditions are {random.choice(trend_directions)} in this area."
    }
    
    return {
        "region_id": region_data["name"].lower().replace(" ", "_"),
        "overall_risk": {
            "level": overall_risk,
            "description": f"Overall environmental risk is {overall_risk}."
        },
        "specific_risks": specific_risks,
        "trend": trend,
        "timestamp": datetime.now().isoformat()
    }

def generate_advice(risk_assessment):
    """Generate advice based on risk assessment"""
    overall_risk = risk_assessment["overall_risk"]["level"]
    specific_risks = risk_assessment["specific_risks"]
    
    # Generate general advice based on overall risk
    if overall_risk == "low":
        general_advice = "Environmental conditions are generally good. Enjoy outdoor activities with normal precautions."
    elif overall_risk == "medium":
        general_advice = "Some environmental risks present. Take moderate precautions, especially if you're in a sensitive group."
    else:
        general_advice = "Significant environmental risks present. Take precautions and limit outdoor exposure if you're in a sensitive group."
    
    # Generate specific recommendations based on specific risks
    specific_recommendations = []
    
    for risk in specific_risks:
        category = risk["category"]
        level = risk["level"]
        
        if category == "Air Quality":
            if level == "low":
                specific_recommendations.append({
                    "category": "Air Quality",
                    "title": "Enjoy outdoor activities",
                    "description": "Air quality is good. It's a great time for outdoor activities.",
                    "urgency": "low",
                    "target_groups": ["All individuals"]
                })
            elif level == "medium":
                specific_recommendations.append({
                    "category": "Air Quality",
                    "title": "Monitor air quality",
                    "description": "Air quality is moderate. Unusually sensitive people should consider reducing prolonged outdoor exertion.",
                    "urgency": "medium",
                    "target_groups": ["People with respiratory conditions", "Elderly", "Children"]
                })
            else:
                specific_recommendations.append({
                    "category": "Air Quality",
                    "title": "Limit outdoor activities",
                    "description": "Air quality is poor. Sensitive groups should reduce outdoor activities, and everyone should avoid prolonged exertion.",
                    "urgency": "high",
                    "target_groups": ["All individuals", "Especially those with respiratory conditions"]
                })
        
        elif category == "UV Exposure":
            if level == "low":
                specific_recommendations.append({
                    "category": "UV Protection",
                    "title": "Basic sun protection",
                    "description": "UV levels are low. Use basic sun protection if outside for extended periods.",
                    "urgency": "low",
                    "target_groups": ["All individuals"]
                })
            elif level == "medium":
                specific_recommendations.append({
                    "category": "UV Protection",
                    "title": "Use sun protection",
                    "description": "UV levels are moderate. Apply SPF 30+ sunscreen and wear protective clothing when outdoors.",
                    "urgency": "medium",
                    "target_groups": ["All individuals", "Especially fair-skinned people"]
                })
            else:
                specific_recommendations.append({
                    "category": "UV Protection",
                    "title": "Take extra sun precautions",
                    "description": "UV levels are high. Apply SPF 50+ sunscreen, wear protective clothing, and seek shade during peak hours (10am-4pm).",
                    "urgency": "high",
                    "target_groups": ["All individuals"]
                })
        
        elif category == "Pollen":
            if level == "low":
                specific_recommendations.append({
                    "category": "Allergy Management",
                    "title": "Low pollen levels",
                    "description": "Pollen levels are low. Good time for outdoor activities for allergy sufferers.",
                    "urgency": "low",
                    "target_groups": ["People with allergies"]
                })
            else:
                specific_recommendations.append({
                    "category": "Allergy Management",
                    "title": "Manage allergy symptoms",
                    "description": "Pollen levels are elevated. Take allergy medication before symptoms start and keep windows closed.",
                    "urgency": "medium",
                    "target_groups": ["People with allergies", "Asthma sufferers"]
                })
    
    # Generate preventive measures
    preventive_measures = [
        "Monitor local air quality reports",
        "Stay hydrated throughout the day",
        "Keep windows closed during high pollution events",
        "Use air purifiers indoors if available",
        "Check weather and environmental conditions before planning outdoor activities",
        "Follow local health department advisories"
    ]
    
    return {
        "region_id": risk_assessment["region_id"],
        "general_advice": general_advice,
        "specific_recommendations": specific_recommendations,
        "preventive_measures": random.sample(preventive_measures, 3),
        "timestamp": datetime.now().isoformat()
    }

async def seed_regions():
    """Seed regions data"""
    print("Seeding regions data...")
    
    for location in LOCATIONS:
        region_data = generate_region_data(location)
        
        # Create region
        result = await appwrite_service.create_region(region_data)
        
        if "error" not in result:
            print(f"Created region: {location['name']}")
        else:
            print(f"Error creating region {location['name']}: {result['error']}")

async def seed_risk_assessments_and_advice():
    """Seed risk assessments and advice"""
    print("Seeding risk assessments and advice...")
    
    # Get all regions
    regions = await appwrite_service.search_regions("")
    
    for region in regions:
        # Generate risk assessment
        risk_assessment = generate_risk_assessment(region)
        
        # Create risk assessment
        # Note: In a real implementation, you would use a proper risk_assessments collection
        # For this example, we're just printing the data
        print(f"Generated risk assessment for {region['name']}")
        
        # Generate advice
        advice = generate_advice(risk_assessment)
        
        # Create advice
        # Note: In a real implementation, you would use a proper advice collection
        # For this example, we're just printing the data
        print(f"Generated advice for {region['name']}")

async def main():
    """Main function to seed data"""
    print("Starting data seeding...")
    
    # Seed regions
    await seed_regions()
    
    # Seed risk assessments and advice
    await seed_risk_assessments_and_advice()
    
    print("Data seeding complete!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
