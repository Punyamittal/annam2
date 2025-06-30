import httpx
from typing import Dict, Any, Optional
import time

class WeatherAPI:
    """
    Service for fetching weather and environmental data from weather APIs
    """
    
    def __init__(self, api_key: str):
        """
        Initialize Weather API service
        
        Args:
            api_key: Weather API key
        """
        self.api_key = api_key
        self.base_url = "https://api.openweathermap.org/data/2.5"
    
    async def get_weather(self, location: str) -> Dict[str, Any]:
        """
        Get current weather data for a location
        
        Args:
            location: Location string (city name, coordinates, etc.)
            
        Returns:
            Dictionary containing weather data
        """
        # First get coordinates from location string
        coordinates = await self._get_coordinates(location)
        
        if not coordinates:
            return {
                "error": "Could not determine coordinates for the location",
                "timestamp": self._get_timestamp()
            }
        
        # Get current weather data
        weather_data = await self._get_current_weather(coordinates["lat"], coordinates["lon"])
        
        # Get air quality data
        air_quality = await self._get_air_quality(coordinates["lat"], coordinates["lon"])
        
        # Get UV index
        uv_index = await self._get_uv_index(coordinates["lat"], coordinates["lon"])
        
        # Combine all data
        result = {
            "location": location,
            "coordinates": coordinates,
            "weather": weather_data,
            "air_quality": air_quality,
            "uv_index": uv_index.get("uv_index", 0),
            "pollen_count": self._get_mock_pollen_data(),  # Mock data as OpenWeather doesn't provide pollen
            "timestamp": self._get_timestamp()
        }
        
        return result
    
    async def _get_coordinates(self, location: str) -> Optional[Dict[str, float]]:
        """
        Get coordinates for a location string
        
        Args:
            location: Location string
            
        Returns:
            Dictionary with lat and lon keys or None if not found
        """
        url = f"http://api.openweathermap.org/geo/1.0/direct"
        params = {
            "q": location,
            "limit": 1,
            "appid": self.api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    return {
                        "lat": data[0]["lat"],
                        "lon": data[0]["lon"]
                    }
            
            return None
    
    async def _get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Get current weather data for coordinates
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Dictionary containing weather data
        """
        url = f"{self.base_url}/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "units": "metric",
            "appid": self.api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "error": f"Weather API error: {response.status_code}",
                    "description": "Could not fetch weather data"
                }
    
    async def _get_air_quality(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Get air quality data for coordinates
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Dictionary containing air quality data
        """
        url = f"{self.base_url}/air_pollution"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                if "list" in data and len(data["list"]) > 0:
                    return {
                        "aqi": data["list"][0]["main"]["aqi"],
                        "components": data["list"][0]["components"],
                        "timestamp": data["list"][0].get("dt", self._get_timestamp())
                    }
            
            return {
                "error": "Could not fetch air quality data",
                "aqi": 0,
                "components": {}
            }
    
    async def _get_uv_index(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Get UV index for coordinates
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Dictionary containing UV index data
        """
        # OpenWeather's OneCall API includes UV index
        url = f"https://api.openweathermap.org/data/3.0/onecall"
        params = {
            "lat": lat,
            "lon": lon,
            "exclude": "minutely,hourly,daily,alerts",
            "appid": self.api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                if "current" in data and "uvi" in data["current"]:
                    return {
                        "uv_index": data["current"]["uvi"]
                    }
            
            # Fallback to mock data if API call fails
            return {
                "uv_index": 5.0  # Moderate UV index as fallback
            }
    
    def _get_mock_pollen_data(self) -> Dict[str, Any]:
        """
        Get mock pollen data (since OpenWeather doesn't provide this)
        
        Returns:
            Dictionary containing mock pollen data
        """
        # In a real app, you would integrate with a pollen-specific API
        return {
            "tree_pollen": {
                "level": "medium",
                "value": 3.5
            },
            "grass_pollen": {
                "level": "low",
                "value": 1.2
            },
            "weed_pollen": {
                "level": "high",
                "value": 4.8
            },
            "mold": {
                "level": "low",
                "value": 1.0
            },
            "overall": {
                "level": "medium",
                "value": 3.0
            }
        }
    
    def _get_timestamp(self) -> int:
        """
        Get current Unix timestamp
        
        Returns:
            Current Unix timestamp
        """
        return int(time.time())
