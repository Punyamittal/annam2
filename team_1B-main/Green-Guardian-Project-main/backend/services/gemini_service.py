import os
import google.generativeai as genai
from typing import Dict, Any, List
import base64

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY", "AIzaSyAREAMXFQAGGScmnA0WVgy02WbP1WrQDCE")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro-vision')

    async def analyze_plant_health(self, image_data: str) -> Dict[str, Any]:
        """
        Analyze plant health using Gemini Vision API
        
        Args:
            image_data: Base64 encoded image data
            
        Returns:
            Dictionary containing plant health analysis results
        """
        try:
            # Remove the data URL prefix if present
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            
            # Create image part for Gemini
            image_parts = [
                {
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                }
            ]
            
            # Create prompt for plant health analysis
            prompt = """
            Analyze this plant image and provide a detailed health assessment. Consider:
            1. Overall plant health (healthy, moderate, or unhealthy)
            2. Visible issues or diseases
            3. Specific recommendations for improvement
            
            Format the response as a JSON object with the following structure:
            {
                "health": "healthy|moderate|unhealthy",
                "confidence": 0.0-1.0,
                "issues": ["list of detected issues"],
                "recommendations": ["list of recommendations"]
            }
            
            Return ONLY the JSON object without any additional text.
            """
            
            # Generate response from Gemini
            response = await self.model.generate_content([prompt, image_parts[0]])
            
            # Extract and parse JSON response
            try:
                content = response.text
                # Find JSON in the response
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    return eval(json_str)  # Using eval since the response is already in Python dict format
                else:
                    return self._create_default_analysis()
            except Exception as e:
                print(f"Error parsing Gemini response: {str(e)}")
                return self._create_default_analysis()
                
        except Exception as e:
            print(f"Error calling Gemini API: {str(e)}")
            return self._create_default_analysis()
    
    def _create_default_analysis(self) -> Dict[str, Any]:
        """
        Create default plant health analysis when API call fails
        
        Returns:
            Default plant health analysis structure
        """
        return {
            "health": "moderate",
            "confidence": 0.7,
            "issues": [
                "Unable to perform detailed analysis",
                "Image quality may need improvement"
            ],
            "recommendations": [
                "Try taking a clearer photo in good lighting",
                "Ensure the entire plant is visible in the frame",
                "Consider consulting a local plant expert"
            ]
        } 