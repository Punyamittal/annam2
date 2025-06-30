import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check if Tavily API key is available
tavily_api_key = os.getenv("TAVILY_API_KEY")
if not tavily_api_key:
    print("WARNING: TAVILY_API_KEY not found in environment variables")
    print("The chat functionality may not work correctly without this key")
else:
    print(f"Found Tavily API key: {tavily_api_key[:5]}...{tavily_api_key[-5:]}")

# Run the FastAPI server
if __name__ == "__main__":
    print("Starting GreenGuardian backend server...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
