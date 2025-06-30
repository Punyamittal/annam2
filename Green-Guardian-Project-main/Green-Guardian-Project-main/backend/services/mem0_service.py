import httpx
from typing import Dict, Any, List, Optional
import time
import json
from .custom_mem0_service import CustomMem0Service

class Mem0Service:
    """
    Service for interacting with Mem0 API for memory storage and retrieval
    Using custom implementation since mem0-python package is not available
    """
    
    def __init__(self, api_key: str):
        """
        Initialize Mem0 service with API key
        
        Args:
            api_key: Mem0 API key
        """
        # Using custom implementation instead of actual Mem0 API
        self.custom_service = CustomMem0Service(api_key)
        
        # Keep these for compatibility with original code
        self.api_key = api_key
        self.base_url = "https://api.mem0.ai/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    async def store_memory(
        self, 
        key: str, 
        data: str, 
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Store a memory in Mem0
        
        Args:
            key: Unique identifier for the memory
            data: String data to store
            metadata: Optional metadata for the memory
            
        Returns:
            Dictionary containing API response
        """
        return await self.custom_service.store_memory(key, data, metadata)
    
    async def retrieve_memory(self, key: str) -> Dict[str, Any]:
        """
        Retrieve a memory from Mem0 by key
        
        Args:
            key: Unique identifier for the memory
            
        Returns:
            Dictionary containing memory data
        """
        return await self.custom_service.retrieve_memory(key)
    
    async def search_memories(
        self, 
        query: str, 
        limit: int = 10, 
        sort_by: str = "timestamp",
        sort_order: str = "desc"
    ) -> List[Dict[str, Any]]:
        """
        Search memories in Mem0
        
        Args:
            query: Search query string
            limit: Maximum number of results to return
            sort_by: Field to sort by
            sort_order: Sort order ("asc" or "desc")
            
        Returns:
            List of memory dictionaries
        """
        return await self.custom_service.search_memories(query, limit, sort_by, sort_order)
    
    async def delete_memory(self, key: str) -> Dict[str, Any]:
        """
        Delete a memory from Mem0
        
        Args:
            key: Unique identifier for the memory
            
        Returns:
            Dictionary containing API response
        """
        return await self.custom_service.delete_memory(key)
    
    def get_current_timestamp(self) -> str:
        """
        Get current timestamp in ISO format
        
        Returns:
            ISO formatted timestamp string
        """
        return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
