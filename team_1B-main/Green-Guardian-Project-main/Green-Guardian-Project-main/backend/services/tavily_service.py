import httpx
from typing import Dict, Any, List, Optional

class TavilyService:
    """
    Service for interacting with Tavily API for search and data retrieval
    """
    
    def __init__(self, api_key: str):
        """
        Initialize Tavily service with API key
        
        Args:
            api_key: Tavily API key
        """
        self.api_key = api_key
        self.base_url = "https://api.tavily.com"
    
    async def search(
        self, 
        query: str, 
        search_depth: str = "basic", 
        include_domains: Optional[List[str]] = None,
        exclude_domains: Optional[List[str]] = None,
        max_results: int = 10
    ) -> Dict[str, Any]:
        """
        Perform a search using Tavily API
        
        Args:
            query: Search query string
            search_depth: "basic" or "advanced"
            include_domains: Optional list of domains to include
            exclude_domains: Optional list of domains to exclude
            max_results: Maximum number of results to return
            
        Returns:
            Dictionary containing search results
        """
        url = f"{self.base_url}/search"
        
        # Prepare request payload
        payload = {
            "api_key": self.api_key,
            "query": query,
            "search_depth": search_depth,
            "max_results": max_results
        }
        
        # Add optional parameters if provided
        if include_domains:
            payload["include_domains"] = include_domains
        
        if exclude_domains:
            payload["exclude_domains"] = exclude_domains
        
        # Make API request
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            
            if response.status_code == 200:
                return response.json()
            else:
                error_message = f"Tavily API error: {response.status_code} - {response.text}"
                print(error_message)
                return {
                    "error": error_message,
                    "results": []
                }
    
    async def search_with_context(
        self, 
        query: str, 
        context: str,
        search_depth: str = "basic", 
        max_results: int = 5
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
        
        # Prepare request payload with context
        payload = {
            "api_key": self.api_key,
            "query": query,
            "search_depth": search_depth,
            "max_results": max_results,
            "context": context
        }
        
        # Make API request
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            
            if response.status_code == 200:
                return response.json()
            else:
                error_message = f"Tavily API error: {response.status_code} - {response.text}"
                print(error_message)
                return {
                    "error": error_message,
                    "results": []
                }
