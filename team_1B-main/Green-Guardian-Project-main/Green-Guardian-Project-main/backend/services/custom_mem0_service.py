import httpx
from typing import Dict, Any, List, Optional
import time
import json

class CustomMem0Service:
    """
    Custom implementation of Mem0 service for memory storage and retrieval
    This is a replacement for the mem0-python package which is not available
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize custom Mem0 service
        
        Args:
            api_key: Optional API key (not used in this implementation)
        """
        self.memories = {}
    
    async def store_memory(
        self, 
        key: str, 
        data: str, 
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Store a memory locally
        
        Args:
            key: Unique identifier for the memory
            data: String data to store
            metadata: Optional metadata for the memory
            
        Returns:
            Dictionary containing response
        """
        timestamp = self.get_current_timestamp()
        
        # Create memory object
        memory = {
            "key": key,
            "data": data,
            "timestamp": timestamp
        }
        
        # Add metadata if provided
        if metadata:
            memory["metadata"] = metadata
        
        # Store in local dictionary
        self.memories[key] = memory
        
        return {
            "success": True,
            "memory": memory
        }
    
    async def retrieve_memory(self, key: str) -> Dict[str, Any]:
        """
        Retrieve a memory by key
        
        Args:
            key: Unique identifier for the memory
            
        Returns:
            Dictionary containing memory data
        """
        if key in self.memories:
            return {
                "success": True,
                "memory": self.memories[key]
            }
        else:
            return {
                "success": False,
                "error": f"Memory with key '{key}' not found"
            }
    
    async def search_memories(
        self, 
        query: str, 
        limit: int = 10, 
        sort_by: str = "timestamp",
        sort_order: str = "desc"
    ) -> List[Dict[str, Any]]:
        """
        Search memories (basic implementation)
        
        Args:
            query: Search query string
            limit: Maximum number of results to return
            sort_by: Field to sort by
            sort_order: Sort order ("asc" or "desc")
            
        Returns:
            List of memory dictionaries
        """
        # Simple search implementation
        results = []
        
        for key, memory in self.memories.items():
            if query.lower() in memory["data"].lower() or query.lower() in key.lower():
                results.append(memory)
        
        # Sort results
        if sort_by in ["timestamp", "key"]:
            reverse = sort_order.lower() == "desc"
            results.sort(key=lambda x: x[sort_by], reverse=reverse)
        
        # Apply limit
        return results[:limit]
    
    async def delete_memory(self, key: str) -> Dict[str, Any]:
        """
        Delete a memory
        
        Args:
            key: Unique identifier for the memory
            
        Returns:
            Dictionary containing response
        """
        if key in self.memories:
            del self.memories[key]
            return {
                "success": True,
                "message": f"Memory with key '{key}' deleted"
            }
        else:
            return {
                "success": False,
                "error": f"Memory with key '{key}' not found"
            }
    
    def get_current_timestamp(self) -> str:
        """
        Get current timestamp in ISO format
        
        Returns:
            ISO formatted timestamp string
        """
        return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
