import json
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

class PollutionAgent:
    """
    Agent that uses Tavily to search for pollution data and then processes it with LLM
    """
    
    def __init__(self, tavily_service):
        """
        Initialize the pollution agent with Tavily service
        
        Args:
            tavily_service: Initialized Tavily service
        """
        self.tavily_service = tavily_service
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    async def get_pollution_data(self, location: str, radius_km: float = 5.0) -> Dict[str, Any]:
        """
        Get pollution data for a specific location
        
        Args:
            location: Location string (city, address, coordinates)
            radius_km: Radius in kilometers to search within
            
        Returns:
            Dictionary containing processed pollution data
        """
        # Construct search query
        search_query = f"current air pollution data in {location} PM2.5 AQI"
        
        # Get search results from Tavily
        search_results = await self.tavily_service.search(
            query=search_query,
            search_depth="advanced",
            include_domains=["airnow.gov", "iqair.com", "epa.gov", "who.int"]
        )
        
        # Extract relevant information using LLM
        pollution_data = await self._extract_pollution_data(search_results, location)
        
        return pollution_data
    
    async def _extract_pollution_data(self, search_results: Dict[str, Any], location: str) -> Dict[str, Any]:
        """
        Extract structured pollution data from search results using LLM
        
        Args:
            search_results: Raw search results from Tavily
            location: Original location query
            
        Returns:
            Structured pollution data
        """
        # Prepare context from search results
        context = ""
        for result in search_results.get("results", []):
            context += f"Source: {result.get('url')}\n"
            context += f"Content: {result.get('content')}\n\n"
        
        # Prepare prompt for LLM
        prompt = f"""
        You are an environmental data analyst. Extract structured pollution data for {location} from the following search results.
        If specific data is not available, make reasonable estimates based on nearby areas or general information.
        
        {context}
        
        Extract and return the following information in JSON format:
        1. air_quality: Object containing AQI (Air Quality Index), PM2.5 level, PM10 level, ozone level, and other pollutants if available
        2. water_quality: Object containing water quality information if available
        3. primary_pollutants: Array of main pollutants in the area
        4. health_implications: Brief description of health implications
        5. sources: Array of main pollution sources in the area
        6. data_confidence: High, Medium, or Low based on the specificity and recency of data
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an environmental data analyst that extracts structured pollution data from search results."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        
        # Extract and parse JSON response
        try:
            content = response.choices[0].message.content
            # Find JSON in the response
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = content[json_start:json_end]
                return json.loads(json_str)
            else:
                # Fallback to default structure if JSON parsing fails
                return self._create_default_pollution_data(location)
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return self._create_default_pollution_data(location)
    
    def _create_default_pollution_data(self, location: str) -> Dict[str, Any]:
        """
        Create default pollution data structure when extraction fails
        
        Args:
            location: Location string
            
        Returns:
            Default pollution data structure
        """
        return {
            "location": location,
            "air_quality": {
                "aqi": 50,
                "pm25": 12.0,
                "pm10": 20.0,
                "ozone": 30.0,
                "category": "Moderate"
            },
            "water_quality": {
                "status": "Unknown",
                "contaminants": []
            },
            "primary_pollutants": ["PM2.5", "Ozone"],
            "health_implications": "Moderate air quality may cause health effects for sensitive groups.",
            "sources": ["Traffic", "Industrial activities"],
            "data_confidence": "Low"
        }
