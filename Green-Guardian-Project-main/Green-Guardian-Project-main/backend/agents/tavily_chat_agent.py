from typing import Dict, List, Any, Optional
import json
from services.tavily_chat_service import TavilyChatService

class TavilyChatAgent:
    """
    Agent that generates chat responses using Tavily search
    """
    
    def __init__(self, tavily_service):
        """Initialize the Tavily chat agent"""
        self.tavily_chat_service = TavilyChatService(tavily_service.api_key)
    
    async def generate_chat_response(
        self, 
        messages: List[Any], 
        environmental_context: Optional[str] = None,
        previous_context: Optional[str] = None,
        user_type: Optional[str] = None
    ) -> str:
        """
        Generate a response to a user chat message using Tavily
        
        Args:
            messages: List of chat messages (ChatMessage objects)
            environmental_context: Optional environmental data as context
            previous_context: Optional previous conversation context
            user_type: Optional user type for personalized responses
            
        Returns:
            Response string
        """
        # Convert ChatMessage objects to dictionaries for compatibility with TavilyChatService
        messages_dict = []
        for message in messages:
            messages_dict.append({
                "role": message.role,
                "content": message.content
            })
            
        # Extract the last user message to check for simple queries
        last_message = None
        for message in reversed(messages_dict):
            if message["role"] == "user":
                last_message = message["content"]
                break
                
        if last_message and self.tavily_chat_service._is_simple_greeting(last_message):
            return self.tavily_chat_service._get_greeting_response()
            
        # Combine environmental context and previous context if available
        combined_context = ""
        
        if environmental_context:
            combined_context += environmental_context
        
        if previous_context:
            if combined_context:
                combined_context += "\n\n"
            combined_context += f"Previous conversation: {previous_context}"
        
        # Generate response using Tavily
        response = await self.tavily_chat_service.generate_response(
            messages=messages_dict,
            environmental_context=environmental_context,
            user_type=user_type
        )
        
        return response
