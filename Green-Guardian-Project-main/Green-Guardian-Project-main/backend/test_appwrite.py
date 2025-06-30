import os
import sys
import json
import asyncio
from dotenv import load_dotenv
from services.appwrite_service import AppwriteService

# Load environment variables
load_dotenv()

async def test_appwrite():
    """Test if Appwrite integration is working correctly"""
    print("Testing Appwrite integration...")
    
    # Get credentials from environment
    endpoint = os.getenv("APPWRITE_ENDPOINT")
    project_id = os.getenv("APPWRITE_PROJECT_ID")
    api_key = os.getenv("APPWRITE_API_KEY")
    
    print(f"Endpoint: {endpoint}")
    print(f"Project ID: {project_id}")
    print(f"API Key: {api_key[:10]}...{api_key[-10:] if api_key else 'None'}")
    
    if not endpoint or not project_id or not api_key:
        print("ERROR: Appwrite credentials not found in environment variables")
        return False
    
    # Initialize Appwrite service
    try:
        appwrite_service = AppwriteService(
            endpoint=endpoint,
            project_id=project_id,
            api_key=api_key
        )
        print("Appwrite service initialized successfully")
    except Exception as e:
        print(f"ERROR: Failed to initialize Appwrite service: {str(e)}")
        return False
    
    # Test connection by listing users
    try:
        print("\nTesting connection to Appwrite...")
        # First, try to list regions (this should work even if no regions exist)
        regions = await appwrite_service.search_regions("test", 5.0)
        print(f"Successfully connected to Appwrite and retrieved {len(regions)} regions")
        
        # Print the first region if available
        if regions and len(regions) > 0:
            print("\nSample region data:")
            print(json.dumps(regions[0], indent=2))
        else:
            print("\nNo regions found in the database")
        
        # Try to log a test event
        print("\nTesting event logging...")
        log_result = await appwrite_service.log_event(
            event_type="test_event",
            data={"test": "value", "source": "test_script"}
        )
        
        if "error" in log_result:
            print(f"ERROR: Failed to log event: {log_result['error']}")
        else:
            print("Successfully logged test event")
            print(f"Log ID: {log_result.get('$id')}")
        
    except Exception as e:
        print(f"ERROR: Failed to connect to Appwrite: {str(e)}")
        return False
    
    print("\nAppwrite integration test completed!")
    return True

if __name__ == "__main__":
    success = asyncio.run(test_appwrite())
    sys.exit(0 if success else 1)
