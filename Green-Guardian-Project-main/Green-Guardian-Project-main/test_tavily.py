import asyncio
import json
import os
from dotenv import load_dotenv
import httpx

# Load environment variables
load_dotenv()

async def test_tavily_search():
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        print("Error: TAVILY_API_KEY not found in environment variables")
        return
    
    base_url = "https://api.tavily.com"
    url = f"{base_url}/search"
    
    # Test query
    query = "water issues and pollution in urban areas"
    
    # Prepare request payload
    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": "basic",
        "max_results": 3
    }
    
    print(f"Testing Tavily API with query: '{query}'")
    print(f"Using API key: {api_key[:5]}...{api_key[-5:]}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            print("Sending request to Tavily API...")
            response = await client.post(url, json=payload)
            
            print(f"Response status code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("\nSearch successful!")
                print(f"Found {len(data.get('results', []))} results")
                
                # Print results
                for i, result in enumerate(data.get('results', [])):
                    print(f"\nResult {i+1}:")
                    print(f"Title: {result.get('title', 'No title')}")
                    print(f"URL: {result.get('url', 'No URL')}")
                    print(f"Content snippet: {result.get('content', 'No content')[:150]}...")
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
    except Exception as e:
        print(f"Exception during API request: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_tavily_search())
