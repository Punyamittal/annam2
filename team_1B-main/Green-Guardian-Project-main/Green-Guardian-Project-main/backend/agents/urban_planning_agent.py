import json
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

class UrbanPlanningAgent:
    """
    Agent that provides urban planning recommendations based on environmental data
    """
    
    def __init__(self, tavily_service):
        """
        Initialize the urban planning agent
        
        Args:
            tavily_service: Initialized Tavily service for data retrieval
        """
        self.tavily_service = tavily_service
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    async def get_risk_zone_analysis(self, location: str, environmental_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze environmental risk zones for urban planning
        
        Args:
            location: Location string
            environmental_data: Dictionary containing environmental data
            
        Returns:
            Dictionary containing risk zone analysis
        """
        # Prepare context for LLM
        context = json.dumps(environmental_data)
        
        # Prepare prompt for LLM
        prompt = f"""
        You are an urban planning expert. Analyze environmental risk zones in {location} based on the following data:
        
        {context}
        
        Provide a detailed risk zone analysis in JSON format with the following structure:
        1. high_risk_areas: Array of identified high-risk areas with descriptions
        2. medium_risk_areas: Array of identified medium-risk areas with descriptions
        3. low_risk_areas: Array of identified low-risk areas with descriptions
        4. risk_factors: Object mapping risk factors to severity levels
        5. recommendations: Array of urban planning recommendations to mitigate risks
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an urban planning expert specializing in environmental risk assessment."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
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
                return self._create_default_risk_zone_analysis(location)
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return self._create_default_risk_zone_analysis(location)
    
    async def get_green_infrastructure_recommendations(self, location: str) -> Dict[str, Any]:
        """
        Get green infrastructure recommendations for a location
        
        Args:
            location: Location string
            
        Returns:
            Dictionary containing green infrastructure recommendations
        """
        # Construct search query
        search_query = f"green infrastructure urban planning solutions for {location} sustainable city development"
        
        # Get search results from Tavily
        search_results = await self.tavily_service.search(
            query=search_query,
            search_depth="advanced",
            include_domains=["epa.gov", "planning.org", "c40.org", "wri.org"]
        )
        
        # Extract relevant information using LLM
        prompt = f"""
        You are an urban planning expert specializing in green infrastructure. Based on the following information, provide green infrastructure recommendations for {location}:
        
        {json.dumps(search_results, indent=2)}
        
        Provide detailed green infrastructure recommendations in JSON format with the following structure:
        1. stormwater_management: Array of stormwater management solutions
        2. urban_heat_mitigation: Array of solutions to reduce urban heat island effect
        3. air_quality_improvement: Array of solutions to improve air quality
        4. biodiversity_enhancement: Array of solutions to enhance urban biodiversity
        5. implementation_strategies: Array of implementation strategies for local government
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an urban planning expert specializing in green infrastructure."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
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
                return self._create_default_green_infrastructure(location)
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return self._create_default_green_infrastructure(location)
    
    async def analyze_pollution_trends(self, location: str, historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze pollution trends based on historical data
        
        Args:
            location: Location string
            historical_data: List of historical environmental data points
            
        Returns:
            Dictionary containing pollution trend analysis
        """
        # Prepare context for LLM
        context = json.dumps(historical_data)
        
        # Prepare prompt for LLM
        prompt = f"""
        You are an environmental data analyst specializing in urban pollution trends. Analyze the following historical pollution data for {location}:
        
        {context}
        
        Provide a detailed pollution trend analysis in JSON format with the following structure:
        1. overall_trend: Object with direction (improving, stable, worsening) and description
        2. pollutant_trends: Object mapping pollutants to their trends
        3. seasonal_patterns: Description of seasonal patterns observed
        4. hotspots: Array of identified pollution hotspots
        5. recommendations: Array of recommendations for pollution reduction
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an environmental data analyst specializing in urban pollution trends."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
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
                return self._create_default_pollution_trend_analysis(location)
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return self._create_default_pollution_trend_analysis(location)
    
    def _create_default_risk_zone_analysis(self, location: str) -> Dict[str, Any]:
        """
        Create default risk zone analysis when generation fails
        
        Args:
            location: Location string
            
        Returns:
            Default risk zone analysis structure
        """
        return {
            "location": location,
            "high_risk_areas": [
                {
                    "name": "Industrial District",
                    "description": "High levels of air pollution and potential chemical exposure"
                },
                {
                    "name": "Low-lying Riverside Areas",
                    "description": "Flood-prone zones with poor drainage infrastructure"
                }
            ],
            "medium_risk_areas": [
                {
                    "name": "Downtown Core",
                    "description": "Urban heat island effect and moderate air quality concerns"
                },
                {
                    "name": "Suburban Expansion Zones",
                    "description": "Habitat fragmentation and increased runoff from development"
                }
            ],
            "low_risk_areas": [
                {
                    "name": "Hillside Residential",
                    "description": "Good air circulation and distance from industrial pollution"
                },
                {
                    "name": "Park-Adjacent Neighborhoods",
                    "description": "Benefit from green space buffering and improved air quality"
                }
            ],
            "risk_factors": {
                "air_pollution": "high",
                "flooding": "medium",
                "urban_heat": "high",
                "water_quality": "medium",
                "biodiversity_loss": "medium"
            },
            "recommendations": [
                "Implement green buffer zones between industrial and residential areas",
                "Enhance stormwater management systems in flood-prone areas",
                "Increase urban tree canopy to mitigate heat island effect",
                "Develop green corridors to connect fragmented habitats",
                "Implement stricter emissions controls for industrial facilities"
            ]
        }
    
    def _create_default_green_infrastructure(self, location: str) -> Dict[str, Any]:
        """
        Create default green infrastructure recommendations when generation fails
        
        Args:
            location: Location string
            
        Returns:
            Default green infrastructure structure
        """
        return {
            "location": location,
            "stormwater_management": [
                "Bioswales along major roadways",
                "Permeable pavement in parking lots and low-traffic areas",
                "Rain gardens in public spaces",
                "Green roofs on municipal buildings",
                "Retention ponds in flood-prone areas"
            ],
            "urban_heat_mitigation": [
                "Increase urban tree canopy to 40% coverage",
                "Cool roof technologies for new construction",
                "Reflective pavement for urban plazas",
                "Green walls on south-facing buildings",
                "Shade structures in public gathering spaces"
            ],
            "air_quality_improvement": [
                "Vegetative buffers along highways",
                "Car-free zones in downtown areas",
                "Urban forests with diverse species selection",
                "Living walls near high-traffic corridors",
                "Air-filtering plant species in public spaces"
            ],
            "biodiversity_enhancement": [
                "Native plant corridors connecting green spaces",
                "Pollinator gardens in parks and medians",
                "Bird and bat habitat installations",
                "Diverse plant species selection in public landscaping",
                "Restored wetland habitats in appropriate areas"
            ],
            "implementation_strategies": [
                "Update zoning codes to require green infrastructure in new developments",
                "Offer tax incentives for private green infrastructure implementation",
                "Develop public-private partnership funding mechanisms",
                "Create demonstration projects on public property",
                "Integrate green infrastructure into capital improvement projects"
            ]
        }
    
    def _create_default_pollution_trend_analysis(self, location: str) -> Dict[str, Any]:
        """
        Create default pollution trend analysis when generation fails
        
        Args:
            location: Location string
            
        Returns:
            Default pollution trend analysis structure
        """
        return {
            "location": location,
            "overall_trend": {
                "direction": "stable",
                "description": "Pollution levels have remained relatively stable over the observed period, with some seasonal fluctuations."
            },
            "pollutant_trends": {
                "pm25": {
                    "direction": "slight improvement",
                    "description": "PM2.5 levels show a slight downward trend, possibly due to emissions controls."
                },
                "ozone": {
                    "direction": "worsening",
                    "description": "Ozone levels have increased, particularly during summer months."
                },
                "no2": {
                    "direction": "stable",
                    "description": "Nitrogen dioxide levels remain consistent with seasonal variations."
                },
                "so2": {
                    "direction": "improving",
                    "description": "Sulfur dioxide shows significant improvement, likely due to industrial regulations."
                }
            },
            "seasonal_patterns": "Pollution levels typically peak during winter months due to increased heating and temperature inversions. Summer months show elevated ozone levels due to increased solar radiation and temperature.",
            "hotspots": [
                {
                    "name": "Industrial District",
                    "pollutants": ["PM2.5", "SO2"],
                    "severity": "high"
                },
                {
                    "name": "Downtown Core",
                    "pollutants": ["NO2", "Ozone"],
                    "severity": "medium"
                },
                {
                    "name": "Highway Corridor",
                    "pollutants": ["PM10", "NO2"],
                    "severity": "high"
                }
            ],
            "recommendations": [
                "Enhance public transportation to reduce vehicle emissions",
                "Implement stricter emissions controls on industrial facilities",
                "Increase urban green space to filter pollutants",
                "Develop early warning system for high pollution days",
                "Create low-emission zones in urban centers"
            ]
        }
