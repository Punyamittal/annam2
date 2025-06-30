from typing import Dict, List, Any, Optional
import json

class MemoryAgent:
    """
    Agent that manages conversation memory using Mem0
    """
    
    def __init__(self, mem0_service):
        """
        Initialize the memory agent with Mem0 service
        
        Args:
            mem0_service: Initialized Mem0 service
        """
        self.mem0_service = mem0_service
    
    async def store_context(self, user_id: str, location: str, messages: List[Dict[str, str]]) -> None:
        """
        Store conversation context in Mem0
        
        Args:
            user_id: User identifier
            location: Location string
            messages: List of chat messages
        """
        # Create a memory entry with metadata
        memory_data = {
            "user_id": user_id,
            "location": location,
            "timestamp": self.mem0_service.get_current_timestamp(),
            "messages": messages
        }
        
        # Store in Mem0 with user_id as key
        await self.mem0_service.store_memory(
            key=user_id,
            data=json.dumps(memory_data),
            metadata={
                "user_id": user_id,
                "location": location,
                "type": "conversation"
            }
        )
    
    async def retrieve_context(self, user_id: str) -> Optional[str]:
        """
        Retrieve conversation context from Mem0
        
        Args:
            user_id: User identifier
            
        Returns:
            String containing conversation context or None if not found
        """
        # Query Mem0 for memories related to this user
        memories = await self.mem0_service.search_memories(
            query=f"user_id:{user_id}",
            limit=5,
            sort_by="timestamp",
            sort_order="desc"
        )
        
        if not memories or len(memories) == 0:
            return None
        
        # Format memories into a context string
        context = "Previous conversations:\n\n"
        for memory in memories:
            try:
                memory_data = json.loads(memory.get("data", "{}"))
                context += f"Location: {memory_data.get('location', 'Unknown')}\n"
                context += f"Time: {memory_data.get('timestamp', 'Unknown')}\n"
                
                # Add messages
                for msg in memory_data.get("messages", []):
                    role = msg.get("role", "unknown")
                    content = msg.get("content", "")
                    context += f"{role.capitalize()}: {content}\n"
                
                context += "\n---\n\n"
            except Exception as e:
                print(f"Error parsing memory: {str(e)}")
                continue
        
        return context
    
    async def store_environmental_data(self, location: str, data: Dict[str, Any]) -> None:
        """
        Store environmental data in Mem0
        
        Args:
            location: Location string
            data: Environmental data dictionary
        """
        # Create a memory entry with metadata
        memory_data = {
            "location": location,
            "timestamp": self.mem0_service.get_current_timestamp(),
            "data": data
        }
        
        # Store in Mem0 with location as key
        await self.mem0_service.store_memory(
            key=f"env_data_{location}",
            data=json.dumps(memory_data),
            metadata={
                "location": location,
                "type": "environmental_data"
            }
        )
    
    async def retrieve_environmental_data(self, location: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve environmental data from Mem0
        
        Args:
            location: Location string
            
        Returns:
            Dictionary containing environmental data or None if not found
        """
        # Query Mem0 for environmental data for this location
        memories = await self.mem0_service.search_memories(
            query=f"location:{location} type:environmental_data",
            limit=1,
            sort_by="timestamp",
            sort_order="desc"
        )
        
        if not memories or len(memories) == 0:
            return None
        
        try:
            memory_data = json.loads(memories[0].get("data", "{}"))
            return memory_data.get("data")
        except Exception as e:
            print(f"Error parsing environmental data: {str(e)}")
            return None
