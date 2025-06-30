import json
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv
import openai
from datetime import datetime

# Import India-specific crop recommendations
from agents.india_crop_recommendations import get_india_crop_recommendations

# Load environment variables
load_dotenv()

class FarmingAgent:
    """
    Agent that provides agricultural recommendations based on environmental data
    """
    
    def __init__(self, tavily_service):
        """
        Initialize the farming agent
        
        Args:
            tavily_service: Initialized Tavily service for data retrieval
        """
        self.tavily_service = tavily_service
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
        # Check if OpenAI API key is valid
        if self.openai_api_key and self.openai_api_key != "not-used":
            self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
            self.use_openai = True
        else:
            self.openai_client = None
            self.use_openai = False
            print("WARNING: OpenAI API key not set or invalid. Using default recommendations only.")
    
    async def get_crop_recommendations(self, location: str, season: Optional[str] = None) -> Dict[str, Any]:
        """
        Get crop recommendations for a specific location and season
        
        Args:
            location: Location string (region, city, etc.)
            season: Optional season specification (spring, summer, fall, winter)
            
        Returns:
            Dictionary containing crop recommendations
        """
        # Determine current season if not provided
        if not season:
            season = self._get_current_season()
        
        # Check if this is an Indian location
        location_lower = location.lower()
        if "india" in location_lower or any(region in location_lower for region in [
            "delhi", "mumbai", "chennai", "kolkata", "bengaluru", "hyderabad",
            "punjab", "haryana", "uttar pradesh", "bihar", "maharashtra", 
            "gujarat", "rajasthan", "tamil nadu", "kerala", "karnataka",
            "west bengal", "assam", "northeast"
        ]):
            # Use India-specific crop recommendations
            return get_india_crop_recommendations(location, season)
        
        # For non-Indian locations, continue with the regular flow
        # Construct search query
        search_query = f"best crops to plant in {location} during {season} season farming guide"
        
        try:
            # Get search results from Tavily
            search_results = await self.tavily_service.search(
                query=search_query,
                search_depth="advanced",
                include_domains=["extension.org", "usda.gov", "agriculture.com", "farmersalmanac.com"]
            )
            
            # Check if search was successful
            if "error" in search_results or not search_results.get("results"):
                print(f"No search results found for {location} in {season}. Using default recommendations.")
                return self._create_default_crop_recommendations(location, season)
            
            # If OpenAI is available, use it to extract crop recommendations
            if self.use_openai:
                try:
                    crop_data = await self._extract_crop_recommendations(search_results, location, season)
                    return crop_data
                except Exception as e:
                    print(f"Error extracting crop recommendations with OpenAI: {str(e)}")
                    # Fall back to simple extraction if OpenAI fails
                    return self._extract_simple_recommendations(search_results, location, season)
            else:
                # Use simple extraction method if OpenAI is not available
                return self._extract_simple_recommendations(search_results, location, season)
                
        except Exception as e:
            print(f"Error in get_crop_recommendations: {str(e)}")
            return self._create_default_crop_recommendations(location, season)
    
    async def get_irrigation_advice(self, location: str, environmental_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get irrigation recommendations based on environmental data
        
        Args:
            location: Location string
            environmental_data: Dictionary containing environmental data
            
        Returns:
            Dictionary containing irrigation recommendations
        """
        # Prepare context for LLM
        context = json.dumps(environmental_data)
        
        # Prepare prompt for LLM
        prompt = f"""
        You are an agricultural expert. Generate irrigation recommendations for {location} based on the following environmental data:
        
        {context}
        
        Provide detailed irrigation advice in JSON format with the following structure:
        1. summary: Brief overall irrigation recommendation
        2. schedule: Recommended irrigation schedule (time of day, frequency)
        3. techniques: Array of recommended irrigation techniques
        4. water_conservation: Tips for conserving water
        5. warnings: Any warnings based on current conditions
        
        Return ONLY the JSON object without any additional text.
        """
        
        if not self.use_openai:
            return self._create_default_irrigation_advice()
        
        # Call OpenAI API
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an agricultural expert that provides irrigation advice."},
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
                    return self._create_default_irrigation_advice()
            except Exception as e:
                print(f"Error parsing LLM response: {str(e)}")
                return self._create_default_irrigation_advice()
        except Exception as e:
            print(f"Error calling OpenAI API: {str(e)}")
            return self._create_default_irrigation_advice()
    
    async def get_pest_management_advice(self, location: str, crop_type: str) -> Dict[str, Any]:
        """
        Get pest management recommendations for specific crops and location
        
        Args:
            location: Location string
            crop_type: Type of crop (e.g., "tomatoes", "corn", "wheat")
            
        Returns:
            Dictionary containing pest management recommendations
        """
        # Construct search query
        search_query = f"pest management for {crop_type} in {location} organic solutions"
        
        # Get search results from Tavily
        search_results = await self.tavily_service.search(
            query=search_query,
            search_depth="advanced",
            include_domains=["extension.org", "usda.gov", "ipm.ucanr.edu"]
        )
        
        if not self.use_openai:
            return self._create_default_pest_management()
        
        # Extract relevant information using LLM
        prompt = f"""
        You are an agricultural pest management expert. Based on the following information, provide pest management advice for {crop_type} in {location}:
        
        {json.dumps(search_results, indent=2)}
        
        Provide detailed pest management recommendations in JSON format with the following structure:
        1. common_pests: Array of objects with pest name and description
        2. prevention: Array of preventive measures
        3. organic_solutions: Array of organic pest control methods
        4. chemical_options: Array of chemical control options (if necessary)
        5. monitoring: Tips for monitoring pest presence
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an agricultural pest management expert."},
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
                    return self._create_default_pest_management()
            except Exception as e:
                print(f"Error parsing LLM response: {str(e)}")
                return self._create_default_pest_management()
        except Exception as e:
            print(f"Error calling OpenAI API: {str(e)}")
            return self._create_default_pest_management()
    
    def _get_current_season(self) -> str:
        """
        Determine current season based on date
        
        Returns:
            Season string (spring, summer, fall, winter)
        """
        month = datetime.now().month
        
        if 3 <= month <= 5:
            return "spring"
        elif 6 <= month <= 8:
            return "summer"
        elif 9 <= month <= 11:
            return "fall"
        else:
            return "winter"
    
    async def _extract_crop_recommendations(self, search_results: Dict[str, Any], location: str, season: str) -> Dict[str, Any]:
        """
        Extract crop recommendations from search results
        
        Args:
            search_results: Raw search results from Tavily
            location: Location string
            season: Season string
            
        Returns:
            Dictionary containing crop recommendations
        """
        # Prepare context from search results
        context = ""
        for result in search_results.get("results", []):
            context += f"Source: {result.get('url')}\n"
            context += f"Content: {result.get('content')}\n\n"
        
        # Prepare prompt for LLM
        prompt = f"""
        You are an agricultural expert. Extract crop recommendations for {location} during {season} season from the following search results.
        
        {context}
        
        Provide detailed crop recommendations in JSON format with the following structure:
        1. recommended_crops: Array of objects, each with crop name, description, and planting_time
        2. soil_preparation: Tips for preparing soil
        3. climate_considerations: Climate factors to consider
        4. local_varieties: Specific varieties that work well in this region
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an agricultural expert that provides crop recommendations."},
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
                return self._create_default_crop_recommendations(location, season)
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return self._create_default_crop_recommendations(location, season)
    
    def _extract_simple_recommendations(self, search_results: Dict[str, Any], location: str, season: str) -> Dict[str, Any]:
        """
        Extract crop recommendations from search results without using LLM
        
        Args:
            search_results: Raw search results from Tavily
            location: Location string
            season: Season string
            
        Returns:
            Dictionary containing crop recommendations
        """
        # Initialize lists for different categories
        crops = []
        soil_tips = []
        climate_notes = []
        varieties = []
        
        # Add Indian crops to the list
        indian_crops = ["rice", "wheat", "maize", "jowar", "bajra", "ragi", 
                       "chickpea", "pigeon pea", "lentil", "groundnut", "mustard", 
                       "soybean", "cotton", "jute", "sugarcane", "tea", "coffee", 
                       "coconut", "mango", "banana", "guava", "papaya", "pomegranate"]
        
        # Extract information from search results
        for result in search_results.get("results", []):
            content = result.get("content", "").lower()
            
            # Look for crop mentions - include Indian crops
            all_crops = indian_crops + ["tomato", "corn", "wheat", "soybean", "lettuce", "kale", "spinach", 
                        "carrot", "potato", "onion", "garlic", "bean", "pea", "squash", 
                        "cucumber", "pepper", "eggplant", "broccoli", "cauliflower", 
                        "cabbage", "radish", "beet", "turnip", "strawberry", "blueberry",
                        "raspberry", "blackberry", "apple", "peach", "pear", "plum", 
                        "cherry", "grape", "watermelon", "cantaloupe", "pumpkin"]
            
            for crop in all_crops:
                if crop in content and not any(c.get("name", "").lower() == crop for c in crops):
                    crops.append({
                        "name": crop.title() + ("es" if crop.endswith("o") else "s"),
                        "description": f"Commonly grown in {location}",
                        "planting_time": f"{season.title()} planting recommended"
                    })
                    if len(crops) >= 3:
                        break
            
            # Look for soil preparation tips
            if "soil" in content:
                sentences = content.split(".")
                for sentence in sentences:
                    if "soil" in sentence and len(sentence) > 15 and len(soil_tips) < 3:
                        cleaned = sentence.strip().capitalize()
                        if cleaned and not any(tip == cleaned for tip in soil_tips):
                            soil_tips.append(cleaned)
            
            # Look for climate considerations
            if "climate" in content or "weather" in content or "temperature" in content:
                sentences = content.split(".")
                for sentence in sentences:
                    if any(word in sentence for word in ["climate", "weather", "temperature", "frost", "rain"]) and len(sentence) > 15 and len(climate_notes) < 3:
                        cleaned = sentence.strip().capitalize()
                        if cleaned and not any(note == cleaned for note in climate_notes):
                            climate_notes.append(cleaned)
            
            # Look for variety mentions
            if "variety" in content or "varieties" in content:
                sentences = content.split(".")
                for sentence in sentences:
                    if "variety" in sentence or "varieties" in sentence:
                        cleaned = sentence.strip().capitalize()
                        if cleaned and len(varieties) < 2:
                            varieties.append(cleaned)
        
        # If we didn't find enough information, add some defaults
        if len(crops) < 3:
            default_recs = self._create_default_crop_recommendations(location, season)
            while len(crops) < 3:
                if len(default_recs["recommended_crops"]) > len(crops) - 1:
                    crops.append(default_recs["recommended_crops"][len(crops)])
                else:
                    break
        
        if not soil_tips:
            soil_tips = ["Test soil pH and amend as needed", 
                        "Add compost to improve soil structure", 
                        "Ensure good drainage"]
        
        if not climate_notes:
            climate_notes = ["Consider local frost dates", 
                            "Plan for seasonal rainfall patterns", 
                            "Be aware of typical temperature ranges"]
        
        if not varieties:
            varieties = [f"Check with local extension office for {location}-specific recommendations"]
        
        # Construct the response
        return {
            "location": location,
            "season": season,
            "recommended_crops": crops[:3],  # Limit to 3 crops
            "soil_preparation": soil_tips[:3],  # Limit to 3 tips
            "climate_considerations": climate_notes[:3],  # Limit to 3 notes
            "local_varieties": varieties[:2]  # Limit to 2 variety notes
        }
    
    def _create_default_crop_recommendations(self, location: str, season: str) -> Dict[str, Any]:
        """
        Create default crop recommendations when extraction fails
        
        Args:
            location: Location string
            season: Season string
            
        Returns:
            Default crop recommendations structure
        """
        # Location-specific default recommendations
        location_lower = location.lower()
        
        # Check for regions/countries and provide more specific recommendations
        if "california" in location_lower or "ca" in location_lower.split():
            return {
                "location": location,
                "season": season,
                "recommended_crops": [
                    {
                        "name": "Avocados",
                        "description": "Thrive in California's Mediterranean climate",
                        "planting_time": "Spring after danger of frost has passed"
                    },
                    {
                        "name": "Almonds",
                        "description": "Major California crop that requires warm, dry summers and mild winters",
                        "planting_time": "Dormant season (December to February)"
                    },
                    {
                        "name": "Wine Grapes",
                        "description": "Perfect for California's diverse microclimates",
                        "planting_time": "Early spring"
                    }
                ],
                "soil_preparation": [
                    "Test soil pH and amend as needed",
                    "Add compost to improve soil structure",
                    "Consider drought-resistant soil amendments"
                ],
                "climate_considerations": [
                    "Plan for water conservation due to drought conditions",
                    "Consider microclimates within California",
                    "Be aware of fire season impacts"
                ],
                "local_varieties": [
                    "UC Davis has specific California-adapted crop varieties",
                    "Consider drought-resistant cultivars"
                ]
            }
        elif "florida" in location_lower or "fl" in location_lower.split():
            return {
                "location": location,
                "season": season,
                "recommended_crops": [
                    {
                        "name": "Citrus",
                        "description": "Oranges, grapefruits, and lemons thrive in Florida's climate",
                        "planting_time": "Spring after danger of frost"
                    },
                    {
                        "name": "Strawberries",
                        "description": "Florida is a major winter strawberry producer",
                        "planting_time": "October to November for winter harvest"
                    },
                    {
                        "name": "Sweet Corn",
                        "description": "Grows well in Florida's warm climate",
                        "planting_time": "January to April"
                    }
                ],
                "soil_preparation": [
                    "Improve sandy soil with organic matter",
                    "Ensure good drainage during rainy season",
                    "Test for nematodes common in Florida soils"
                ],
                "climate_considerations": [
                    "Plan for hurricane season (June to November)",
                    "Consider high humidity impacts on crops",
                    "Be aware of occasional freezes in northern Florida"
                ],
                "local_varieties": [
                    "University of Florida IFAS has recommended varieties for the state",
                    "Look for heat-tolerant and disease-resistant varieties"
                ]
            }
        # Season-specific recommendations if location isn't recognized
        elif season.lower() == "spring":
            return {
                "location": location,
                "season": season,
                "recommended_crops": [
                    {
                        "name": "Lettuce",
                        "description": "Cool-season crop perfect for spring planting",
                        "planting_time": "Early spring as soon as soil can be worked"
                    },
                    {
                        "name": "Peas",
                        "description": "Early spring crop that fixes nitrogen in soil",
                        "planting_time": "As soon as soil can be worked in early spring"
                    },
                    {
                        "name": "Radishes",
                        "description": "Quick-growing crop for early harvest",
                        "planting_time": "Early spring, can be succession planted"
                    }
                ],
                "soil_preparation": [
                    "Test soil pH and amend as needed",
                    "Add compost to improve soil structure",
                    "Ensure good drainage for spring rains"
                ],
                "climate_considerations": [
                    "Watch for late spring frosts",
                    "Consider row covers for frost protection",
                    "Monitor soil temperature for proper planting time"
                ],
                "local_varieties": [
                    "Check with local extension office for region-specific recommendations"
                ]
            }
        elif season.lower() == "summer":
            return {
                "location": location,
                "season": season,
                "recommended_crops": [
                    {
                        "name": "Tomatoes",
                        "description": "Heat-loving summer crop",
                        "planting_time": "After danger of frost has passed"
                    },
                    {
                        "name": "Peppers",
                        "description": "Thrive in summer heat",
                        "planting_time": "After soil has warmed in late spring"
                    },
                    {
                        "name": "Cucumbers",
                        "description": "Fast-growing summer crop",
                        "planting_time": "After soil warms and danger of frost has passed"
                    }
                ],
                "soil_preparation": [
                    "Test soil pH and amend as needed",
                    "Add compost to improve soil structure",
                    "Consider mulch to retain moisture during hot weather"
                ],
                "climate_considerations": [
                    "Plan for irrigation during hot, dry periods",
                    "Consider afternoon shade in very hot climates",
                    "Monitor for pest pressure which increases in summer"
                ],
                "local_varieties": [
                    "Check with local extension office for region-specific recommendations"
                ]
            }
        elif season.lower() == "fall":
            return {
                "location": location,
                "season": season,
                "recommended_crops": [
                    {
                        "name": "Kale",
                        "description": "Cold-hardy crop that improves with frost",
                        "planting_time": "Mid to late summer for fall harvest"
                    },
                    {
                        "name": "Spinach",
                        "description": "Quick-growing crop for fall harvest",
                        "planting_time": "Late summer to early fall"
                    },
                    {
                        "name": "Garlic",
                        "description": "Plant in fall for harvest next summer",
                        "planting_time": "Mid-fall before ground freezes"
                    }
                ],
                "soil_preparation": [
                    "Test soil pH and amend as needed",
                    "Add compost to improve soil structure",
                    "Clear summer crop debris before planting"
                ],
                "climate_considerations": [
                    "Calculate days to maturity before first expected frost",
                    "Consider row covers for extending season",
                    "Plan for decreasing daylight hours"
                ],
                "local_varieties": [
                    "Check with local extension office for region-specific recommendations"
                ]
            }
        elif season.lower() == "winter":
            return {
                "location": location,
                "season": season,
                "recommended_crops": [
                    {
                        "name": "Cover Crops",
                        "description": "Winter rye, vetch, or clover to improve soil",
                        "planting_time": "Fall before ground freezes"
                    },
                    {
                        "name": "Winter Wheat",
                        "description": "For areas with mild winters",
                        "planting_time": "Early to mid-fall"
                    },
                    {
                        "name": "Microgreens (Indoor)",
                        "description": "Quick-growing crops for indoor winter production",
                        "planting_time": "Anytime indoors"
                    }
                ],
                "soil_preparation": [
                    "Test soil pH and amend as needed",
                    "Add compost to improve soil structure",
                    "Consider raised beds for better drainage in wet winter areas"
                ],
                "climate_considerations": [
                    "Plan for cold protection in outdoor growing",
                    "Consider greenhouse or cold frame use",
                    "In mild winter areas, use row covers for frost protection"
                ],
                "local_varieties": [
                    "Check with local extension office for region-specific recommendations"
                ]
            }
        else:
            # Generic default if no specific location or season match
            return {
                "location": location,
                "season": season,
                "recommended_crops": [
                    {
                        "name": "Tomatoes",
                        "description": "Versatile crop that grows well in many climates",
                        "planting_time": "After danger of frost has passed"
                    },
                    {
                        "name": "Lettuce",
                        "description": "Quick-growing leafy vegetable",
                        "planting_time": "Early spring or fall"
                    },
                    {
                        "name": "Beans",
                        "description": "Nitrogen-fixing plants good for soil health",
                        "planting_time": "After soil warms in spring"
                    }
                ],
                "soil_preparation": [
                    "Test soil pH and amend as needed",
                    "Add compost to improve soil structure",
                    "Ensure good drainage"
                ],
                "climate_considerations": [
                    "Consider local frost dates",
                    "Plan for seasonal rainfall patterns",
                    "Be aware of typical temperature ranges"
                ],
                "local_varieties": [
                    f"Check with local extension office for {location}-specific recommendations"
                ]
            }
    
    def _create_default_irrigation_advice(self) -> Dict[str, Any]:
        """
        Create default irrigation advice when generation fails
        
        Returns:
            Default irrigation advice structure
        """
        return {
            "summary": "Water deeply but infrequently to encourage deep root growth.",
            "schedule": {
                "frequency": "2-3 times per week",
                "time_of_day": "Early morning (before 10am)"
            },
            "techniques": [
                "Drip irrigation for efficient water use",
                "Soaker hoses for row crops",
                "Mulching to reduce evaporation"
            ],
            "water_conservation": [
                "Use rain barrels to collect rainwater",
                "Apply mulch to reduce evaporation",
                "Group plants with similar water needs together"
            ],
            "warnings": [
                "Avoid overhead watering during hot, sunny days to prevent leaf scorch",
                "Monitor soil moisture before watering to prevent overwatering"
            ]
        }
    
    def _create_default_pest_management(self) -> Dict[str, Any]:
        """
        Create default pest management advice when generation fails
        
        Returns:
            Default pest management structure
        """
        return {
            "common_pests": [
                {
                    "name": "Aphids",
                    "description": "Small sap-sucking insects that can cause leaf curling and stunted growth"
                },
                {
                    "name": "Cabbage worms",
                    "description": "Green caterpillars that feed on leaves of brassica crops"
                },
                {
                    "name": "Tomato hornworms",
                    "description": "Large green caterpillars that can quickly defoliate tomato plants"
                }
            ],
            "prevention": [
                "Crop rotation to disrupt pest cycles",
                "Companion planting to repel pests",
                "Row covers to physically block pests"
            ],
            "organic_solutions": [
                "Neem oil spray for multiple pests",
                "Insecticidal soap for soft-bodied insects",
                "Bacillus thuringiensis (Bt) for caterpillars"
            ],
            "chemical_options": [
                "Use chemical controls only as a last resort",
                "Follow all label instructions carefully",
                "Choose the least toxic option that will be effective"
            ],
            "monitoring": [
                "Check plants regularly, especially leaf undersides",
                "Use sticky traps to monitor flying insect populations",
                "Keep records of pest occurrences to plan for next season"
            ]
        }
