import json
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

class AdviceAgent:
    """
    Agent that generates environmental advice and risk assessments
    """
    
    def __init__(self):
        """Initialize the advice agent"""
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    async def generate_risk_assessment(self, environmental_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate risk assessment based on environmental data
        
        Args:
            environmental_data: Dictionary containing environmental data
            
        Returns:
            Dictionary containing risk assessment
        """
        # Prepare prompt for LLM
        prompt = f"""
        You are an environmental health expert. Generate a risk assessment based on the following environmental data:
        
        {json.dumps(environmental_data, indent=2)}
        
        Provide a comprehensive risk assessment in JSON format with the following structure:
        1. overall_risk: Object with level (high, medium, low) and description
        2. specific_risks: Array of objects, each with category, level, description, and affected_groups
        3. trend: Object with direction (improving, stable, worsening) and description
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an environmental health expert that generates risk assessments."},
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
                return self._create_default_risk_assessment()
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return self._create_default_risk_assessment()
    
    async def generate_advice(self, environmental_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate preventive advice based on environmental data
        
        Args:
            environmental_data: Dictionary containing environmental data
            
        Returns:
            Dictionary containing advice
        """
        # Prepare prompt for LLM
        prompt = f"""
        You are an environmental health advisor. Generate practical advice based on the following environmental data:
        
        {json.dumps(environmental_data, indent=2)}
        
        Provide actionable advice in JSON format with the following structure:
        1. general_advice: Brief overall recommendation
        2. specific_recommendations: Array of objects, each with category, title, description, urgency (high, medium, low), and target_groups
        3. preventive_measures: Array of long-term preventive measures
        
        Return ONLY the JSON object without any additional text.
        """
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an environmental health advisor that generates practical advice."},
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
                return self._create_default_advice()
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return self._create_default_advice()
    
    async def generate_chat_response(
        self, 
        messages: List[Dict[str, str]], 
        environmental_context: Optional[str] = None,
        previous_context: Optional[str] = None,
        user_type: Optional[str] = None
    ) -> str:
        """
        Generate a response to a user chat message
        
        Args:
            messages: List of chat messages
            environmental_context: Optional environmental data as context
            previous_context: Optional previous conversation context
            user_type: Optional user type for personalized responses
            
        Returns:
            Response string
        """
        # Prepare system message with context
        system_message = """
        You are GreenGuardian's environmental assistant. You help users understand environmental conditions 
        and provide practical advice for staying healthy and safe.
        
        Guidelines:
        - Be concise and practical
        - Cite sources when providing specific health advice
        - Acknowledge limitations in your data when appropriate
        - Focus on actionable information
        """
        
        # Add user type context if available
        if user_type:
            if user_type == "farmer":
                system_message += "\n\nThe user is a farmer. Focus on agricultural implications of environmental conditions, crop recommendations, irrigation advice, and pest management strategies."
            elif user_type == "urban_planner":
                system_message += "\n\nThe user is an urban planner. Focus on environmental risk zones, green infrastructure opportunities, pollution trends, and sustainable urban development strategies."
            elif user_type == "ngo":
                system_message += "\n\nThe user represents an NGO. Focus on environmental justice issues, community impact of pollution, trend analysis, and policy recommendations."
            else:  # citizen
                system_message += "\n\nThe user is a citizen. Focus on personal health implications, daily activity recommendations, and practical advice for environmental conditions."
        
        # Add environmental context if available
        if environmental_context:
            system_message += f"\n\nCurrent environmental data for the user's location:\n{environmental_context}"
        
        # Add previous conversation context if available
        if previous_context:
            system_message += f"\n\nPrevious conversation context:\n{previous_context}"
        
        # Prepare messages for API call
        api_messages = [{"role": "system", "content": system_message}]
        for message in messages:
            api_messages.append({"role": message["role"], "content": message["content"]})
        
        # Call OpenAI API
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=api_messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    
    def _create_default_risk_assessment(self) -> Dict[str, Any]:
        """
        Create default risk assessment when generation fails
        
        Returns:
            Default risk assessment structure
        """
        return {
            "overall_risk": {
                "level": "medium",
                "description": "Moderate environmental risks present in the area."
            },
            "specific_risks": [
                {
                    "category": "Air Quality",
                    "level": "medium",
                    "description": "Moderate levels of air pollution may affect sensitive groups.",
                    "affected_groups": ["Children", "Elderly", "People with respiratory conditions"]
                },
                {
                    "category": "UV Exposure",
                    "level": "medium",
                    "description": "Moderate UV levels may cause skin damage with prolonged exposure.",
                    "affected_groups": ["All outdoor workers", "Children", "Fair-skinned individuals"]
                }
            ],
            "trend": {
                "direction": "stable",
                "description": "Environmental conditions have remained relatively stable."
            }
        }
    
    def _create_default_advice(self) -> Dict[str, Any]:
        """
        Create default advice when generation fails
        
        Returns:
            Default advice structure
        """
        return {
            "general_advice": "Take basic precautions for moderate environmental conditions.",
            "specific_recommendations": [
                {
                    "category": "Air Quality",
                    "title": "Limit outdoor activities during peak pollution hours",
                    "description": "Consider indoor activities during late afternoon when pollution levels are typically highest.",
                    "urgency": "medium",
                    "target_groups": ["Children", "Elderly", "People with respiratory conditions"]
                },
                {
                    "category": "UV Protection",
                    "title": "Use sun protection",
                    "description": "Apply SPF 30+ sunscreen and wear protective clothing when outdoors.",
                    "urgency": "medium",
                    "target_groups": ["All individuals"]
                }
            ],
            "preventive_measures": [
                "Monitor local air quality reports",
                "Stay hydrated throughout the day",
                "Keep windows closed during high pollution events"
            ]
        }
