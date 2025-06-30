import httpx
from typing import Dict, Any, List, Optional
import json
import asyncio

class TavilyChatService:
    """
    Service for using Tavily API for chat functionality
    """
    
    def __init__(self, api_key: str):
        """
        Initialize Tavily chat service with API key
        
        Args:
            api_key: Tavily API key
        """
        self.api_key = api_key
        self.base_url = "https://api.tavily.com"
        self.response_cache = {}  # Simple in-memory cache
        
    async def generate_response(
        self, 
        messages: List[Dict[str, str]], 
        environmental_context: Optional[str] = None,
        user_type: Optional[str] = None
    ) -> str:
        """
        Generate a chat response using Tavily's search capabilities
        
        Args:
            messages: List of chat messages
            environmental_context: Optional environmental data as context
            user_type: Optional user type for personalized responses
            
        Returns:
            Response string
        """
        # Extract the last user message
        last_message = None
        for message in reversed(messages):
            if message["role"] == "user":
                last_message = message["content"]
                break
        
        if not last_message:
            return "I don't see a question to respond to. How can I help you with environmental information?"
        
        # Check for simple greetings
        if self._is_simple_greeting(last_message):
            return self._get_greeting_response()
            
        # Check cache for this query
        cache_key = f"{last_message}_{user_type}"
        if cache_key in self.response_cache:
            print(f"Using cached response for: {last_message}")
            return self.response_cache[cache_key]
        
        # Check for specific environmental queries that we can handle directly
        direct_response = self._check_for_direct_response(last_message)
        if direct_response:
            return direct_response
        
        # Build search query with context
        query = last_message
        print(f"Processing query: {query}")
        
        # Add user type context to search
        search_context = "Focus on environmental science, climate data, pollution information, and sustainability topics. "
        if user_type:
            if user_type == "farmer":
                search_context += "Information relevant for farmers about environmental conditions, crops, irrigation, and pest management. "
            elif user_type == "urban_planner":
                search_context += "Information relevant for urban planners about environmental risk zones, green infrastructure, and pollution trends. "
            elif user_type == "ngo":
                search_context += "Information relevant for NGOs about environmental justice, community impact, and policy recommendations. "
            else:  # citizen
                search_context += "Information relevant for citizens about personal health implications and environmental conditions. "
        
        # Add environmental context if available
        if environmental_context:
            try:
                env_data = json.loads(environmental_context)
                search_context += f"Current environmental data: Air quality index: {env_data.get('air_quality', {}).get('aqi', 'N/A')}, "
                search_context += f"Location: {env_data.get('location', 'Unknown')}, "
                if 'weather' in env_data and env_data['weather']:
                    search_context += f"Temperature: {env_data['weather'].get('temperature', 'N/A')}°C, "
                    search_context += f"Humidity: {env_data['weather'].get('humidity', 'N/A')}%, "
                    search_context += f"Wind: {env_data['weather'].get('wind_speed', 'N/A')} km/h. "
            except Exception as e:
                print(f"Error parsing environmental context: {str(e)}")
                search_context += "Environmental context available but could not be parsed. "
        
        # Perform search with context and timeout
        try:
            # Set a timeout for the search request
            print(f"Sending search request to Tavily with query: {query}")
            search_results = await asyncio.wait_for(
                self.search_with_context(query, search_context),
                timeout=15.0  # 15 second timeout
            )
            print(f"Received search results from Tavily")
            
            # Debug: Print the search results
            print(f"Search results: {json.dumps(search_results, indent=2)[:500]}...")
            
        except asyncio.TimeoutError:
            print("Tavily search timed out")
            return "I'm still processing your question. Could you please try again in a moment?"
        except Exception as e:
            print(f"Error in Tavily search: {str(e)}")
            return "I'm having trouble finding information about that right now. Is there something else I can help with?"
        
        # Check if Tavily provided a direct answer
        if "answer" in search_results and search_results["answer"]:
            print("Using Tavily's direct answer")
            content = search_results["answer"]
            response = self._format_response(query, content, user_type)
            self.response_cache[cache_key] = response
            return response
        
        # If no API results, provide a general response based on the query
        if "error" in search_results or not search_results.get("results"):
            print("No results found or error in search results")
            # Generate a general response based on the query
            return self._generate_fallback_response(query)
        
        # Format response based on search results
        content = ""
        if "results" in search_results and search_results["results"]:
            for result in search_results["results"][:3]:  # Use top 3 results
                content += result.get("content", "") + "\n\n"
        
        # If no content was found, return a default message
        if not content:
            print("No content extracted from results")
            return self._generate_fallback_response(query)
        
        # Format the response
        response = self._format_response(query, content, user_type)
        
        # Cache the response
        self.response_cache[cache_key] = response
        
        # Limit cache size to prevent memory issues
        if len(self.response_cache) > 100:
            # Remove oldest item (first key)
            self.response_cache.pop(next(iter(self.response_cache)))
            
        return response
    
    def _check_for_direct_response(self, query: str) -> Optional[str]:
        """
        Check if we can provide a direct response without searching
        
        Args:
            query: User query
            
        Returns:
            Direct response or None
        """
        query_lower = query.lower()
        
        # Check for specific environmental topics
        if query_lower == "what is climate change":
            return ("Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, "
                   "but since the 1800s, human activities have been the main driver of climate change, primarily due to burning "
                   "fossil fuels like coal, oil, and gas, which produces heat-trapping gases. The effects include rising temperatures, "
                   "more severe weather events, rising sea levels, and disruptions to ecosystems.")
        
        elif query_lower == "what is air pollution":
            return ("Air pollution occurs when harmful substances are introduced into the Earth's atmosphere. These can include "
                   "particulate matter (PM2.5 and PM10), nitrogen dioxide (NO2), sulfur dioxide (SO2), carbon monoxide (CO), "
                   "and ozone (O3). Sources include vehicle emissions, industrial activities, and burning fossil fuels. "
                   "Air pollution can cause respiratory issues, cardiovascular problems, and other health concerns.")
        
        elif query_lower == "what is water pollution":
            return ("Water pollution occurs when harmful substances contaminate bodies of water, degrading water quality and "
                   "making it toxic to humans or the environment. Sources include industrial discharge, agricultural runoff, "
                   "and urban waste. Water pollution can harm aquatic ecosystems, reduce drinking water supplies, and pose "
                   "health risks to humans and animals.")
        
        elif query_lower == "what are renewable energy sources":
            return ("Renewable energy sources are those that are naturally replenished and don't deplete with use. They include: "
                   "Solar energy (from the sun), Wind energy (from air currents), Hydropower (from flowing water), "
                   "Geothermal energy (from the Earth's heat), and Biomass (from organic materials). "
                   "These sources produce minimal greenhouse gas emissions and help combat climate change.")
        
        return None
    
    def _generate_fallback_response(self, query: str) -> str:
        """
        Generate a fallback response based on the query topic
        
        Args:
            query: User query
            
        Returns:
            Fallback response
        """
        query_lower = query.lower()
        
        if "weather" in query_lower or "temperature" in query_lower or "climate" in query_lower:
            return ("Weather refers to short-term atmospheric conditions like temperature, humidity, precipitation, wind speed, and air pressure "
                   "in a specific place and time. Climate refers to long-term weather patterns in a particular region. "
                   "Climate change is causing more extreme weather events, rising temperatures, and shifting precipitation patterns globally. "
                   "For accurate current weather information, I recommend checking a local weather service or app.")
        
        elif "pollution" in query_lower or "air quality" in query_lower:
            return ("Air pollution is a major environmental concern affecting human health and ecosystems. Common air pollutants include "
                   "particulate matter (PM2.5 and PM10), nitrogen dioxide (NO2), sulfur dioxide (SO2), carbon monoxide (CO), and ozone (O3). "
                   "These come from sources like vehicle emissions, industrial activities, and burning fossil fuels. Poor air quality can cause "
                   "respiratory issues, cardiovascular problems, and other health concerns, especially for vulnerable populations.")
        
        elif "water" in query_lower:
            return ("Water quality is essential for both human health and ecosystem functioning. Water pollution can come from various sources, "
                   "including industrial discharge, agricultural runoff, and urban waste. Key water quality parameters include pH, dissolved oxygen, "
                   "turbidity, and the presence of contaminants like heavy metals, pesticides, and bacteria. Clean water is necessary for drinking, "
                   "agriculture, and supporting aquatic life.")
        
        elif "plant" in query_lower or "garden" in query_lower or "farming" in query_lower or "agriculture" in query_lower:
            return ("Plants are affected by various environmental factors including temperature, precipitation, soil quality, and sunlight. "
                   "Climate change is altering growing seasons and creating new challenges for agriculture and gardening. Sustainable farming "
                   "practices like crop rotation, reduced tillage, and integrated pest management can help mitigate environmental impacts while "
                   "maintaining productivity.")
        
        elif "recycling" in query_lower or "waste" in query_lower or "plastic" in query_lower:
            return ("Waste management and recycling are important for reducing environmental impact. Recycling helps conserve resources, reduce "
                   "landfill waste, and lower greenhouse gas emissions. Materials commonly recycled include paper, glass, metals, and certain plastics. "
                   "Reducing consumption, reusing items, and properly disposing of waste are also key practices for environmental sustainability.")
        
        elif "energy" in query_lower or "power" in query_lower or "electricity" in query_lower:
            return ("Energy production and consumption have significant environmental impacts. Fossil fuels like coal, oil, and natural gas contribute "
                   "to air pollution and climate change. Renewable energy sources such as solar, wind, hydroelectric, and geothermal power offer cleaner "
                   "alternatives with lower environmental impacts. Energy efficiency and conservation measures can also help reduce environmental footprints.")
        
        else:
            return ("Environmental science covers many interconnected topics including air and water quality, climate patterns, biodiversity, ecosystem health, "
                   "and human impacts on natural systems. Environmental conditions affect human health, agriculture, infrastructure, and natural habitats. "
                   "Sustainable practices and policies aim to balance human needs with environmental protection for current and future generations.")
    
    def _is_simple_greeting(self, text: str) -> bool:
        """Check if the message is a simple greeting"""
        text = text.lower().strip()
        greetings = ['hi', 'hello', 'hey', 'greetings', 'howdy', 'hi there', 'hello there']
        return any(text == greeting for greeting in greetings)
    
    def _get_greeting_response(self) -> str:
        """Return a friendly greeting response"""
        return "Hello! I'm your environmental assistant. How can I help you today? You can ask me about air quality, weather conditions, environmental risks, or farming advice."
    
    async def search_with_context(
        self, 
        query: str, 
        context: str,
        search_depth: str = "advanced",  # Advanced for better results
        max_results: int = 5  # Increased for better coverage
    ) -> Dict[str, Any]:
        """
        Perform a search with additional context using Tavily API
        
        Args:
            query: Search query string
            context: Additional context to guide the search
            search_depth: "basic" or "advanced"
            max_results: Maximum number of results to return
            
        Returns:
            Dictionary containing search results
        """
        url = f"{self.base_url}/search"
        
        # Enhance query with environmental focus
        enhanced_query = query
        if not any(term in query.lower() for term in ["environment", "climate", "pollution", "weather", "ecological", "sustainability"]):
            enhanced_query = f"environmental science information about {query}"
        
        # Prepare request payload with context
        payload = {
            "api_key": self.api_key,
            "query": enhanced_query,
            "search_depth": search_depth,
            "max_results": max_results,
            "include_answer": True,
            "include_domains": ["epa.gov", "noaa.gov", "nasa.gov", "who.int", "un.org", "nationalgeographic.com", "nature.com", "science.org", "scientificamerican.com"]
        }
        
        # Only add context if it's not too long (to avoid API errors)
        if context and len(context) < 1000:
            payload["context"] = context + " Focus on environmental science, climate data, pollution information, and sustainability topics."
            
        print(f"Sending Tavily search request for query: {enhanced_query}")
        print(f"Using API key: {self.api_key[:5]}...{self.api_key[-5:]}")
        print(f"URL: {url}")
        
        try:
            # Make API request
            async with httpx.AsyncClient(timeout=12.0) as client:  # 12 second timeout
                print(f"Sending request to Tavily API: {url}")
                response = await client.post(url, json=payload)
                
                print(f"Tavily API response status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"Tavily API response successful with {len(result.get('results', []))} results")
                    return result
                else:
                    error_message = f"Tavily API error: {response.status_code} - {response.text}"
                    print(error_message)
                    return {
                        "error": error_message,
                        "results": []
                    }
        except Exception as e:
            print(f"Exception during Tavily API request: {str(e)}")
            return {
                "error": f"Exception during API request: {str(e)}",
                "results": []
            }
    
    def _format_response(self, query: str, content: str, user_type: Optional[str] = None) -> str:
        """
        Format the response based on search results and user type
        
        Args:
            query: Original query
            content: Content from search results
            user_type: Optional user type
            
        Returns:
            Formatted response
        """
        # Truncate content if too long
        if len(content) > 1500:  # Increased for more comprehensive responses
            content = content[:1500] + "..."
        
        # Clean up the content
        content = self._clean_content(content)
        
        # Add user type specific intro
        intro = "Here's what I found about environmental aspects of your question: "
        
        if "weather" in query.lower():
            intro = "Here's the current weather information: "
        elif "climate" in query.lower():
            intro = "Here's what I found about climate conditions: "
        elif "pollution" in query.lower() or "air quality" in query.lower():
            intro = "Here's what I found about pollution and air quality: "
        elif "water" in query.lower():
            intro = "Here's what I found about water conditions: "
        elif "plant" in query.lower() or "garden" in query.lower():
            intro = "Here's what I found about plants and gardening: "
        
        # Add user type specific intro
        if user_type == "farmer":
            intro = "From an agricultural perspective: "
        elif user_type == "urban_planner":
            intro = "From an urban planning perspective: "
        elif user_type == "ngo":
            intro = "From an environmental policy perspective: "
        
        # Add a conclusion with environmental advice if appropriate
        conclusion = ""
        if any(term in query.lower() for term in ["pollution", "waste", "plastic", "carbon", "emissions"]):
            conclusion = "\n\nRemember that individual actions like reducing waste, conserving energy, and choosing sustainable options can collectively make a significant positive impact on our environment."
        
        return f"{intro}\n\n{content}{conclusion}"
        
    def _clean_content(self, content: str) -> str:
        """
        Clean up the content to make it more readable
        
        Args:
            content: Raw content from search results
            
        Returns:
            Cleaned content
        """
        # Remove URLs
        import re
        content = re.sub(r'https?://\S+', '', content)
        
        # Remove markdown image tags
        content = re.sub(r'!\[.*?\]\(.*?\)', '', content)
        
        # Remove HTML tags
        content = re.sub(r'<.*?>', '', content)
        
        # Remove excessive whitespace
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # Remove dictionary-style entries that aren't useful
        content = re.sub(r'\[.*?\]\(/dictionary/.*?\)', '', content)
        
        # Remove social media metrics
        content = re.sub(r'\d+ (likes|views|shares)', '', content)
        
        # Remove dates in specific formats if they're not relevant
        content = re.sub(r'\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}', '', content)
        
        return content.strip()
