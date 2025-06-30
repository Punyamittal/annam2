import os
import sys
import json
import asyncio
from dotenv import load_dotenv
from services.appwrite_service_fixed import AppwriteService

# Load environment variables
load_dotenv()

async def test_appwrite_service():
    """Test the fixed AppwriteService class"""
    print("Testing fixed AppwriteService class...")
    
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
        print("AppwriteService initialized successfully")
    except Exception as e:
        print(f"ERROR: Failed to initialize AppwriteService: {str(e)}")
        return False
    
    # Test region operations
    try:
        print("\nTesting region operations...")
        
        # Create a test region
        region_data = {
            "location": "Test Region"
        }
        
        print("Creating test region...")
        create_result = await appwrite_service.create_region(region_data)
        
        if "error" in create_result:
            print(f"ERROR: Failed to create region: {create_result['error']}")
            return False
        
        region_id = create_result.get("$id")
        print(f"Test region created with ID: {region_id}")
        
        # Get the region
        print("Getting test region...")
        get_result = await appwrite_service.get_region_data(region_id)
        
        if "error" in get_result:
            print(f"ERROR: Failed to get region: {get_result['error']}")
        else:
            print(f"Retrieved region location: {get_result.get('location')}")
        
        # Update the region
        print("Updating test region...")
        update_data = {
            "location": "Updated Test Region"
        }
        
        update_result = await appwrite_service.update_region(region_id, update_data)
        
        if "error" in update_result:
            print(f"ERROR: Failed to update region: {update_result['error']}")
        else:
            print(f"Updated region location: {update_result.get('location')}")
        
        # Search for regions
        print("Searching for regions...")
        search_result = await appwrite_service.search_regions("Test", 5.0)
        
        print(f"Found {len(search_result)} regions")
        
        # Clean up - delete the test region
        # Note: We can't delete directly with the AppwriteService class as it doesn't have a delete method
        # We'll use the REST API directly
        print("Cleaning up test region...")
        
        headers = {
            'X-Appwrite-Project': project_id,
            'X-Appwrite-Key': api_key,
            'Content-Type': 'application/json'
        }
        
        import requests
        delete_response = requests.delete(
            f"{endpoint}/databases/{appwrite_service.database_id}/collections/{appwrite_service.regions_collection_id}/documents/{region_id}",
            headers=headers
        )
        
        if delete_response.status_code == 204:
            print("Successfully deleted test region")
        else:
            print(f"ERROR: Failed to delete test region. Status code: {delete_response.status_code}")
    
    except Exception as e:
        print(f"ERROR: Failed to test region operations: {str(e)}")
    
    # Test log event
    try:
        print("\nTesting log event...")
        
        log_result = await appwrite_service.log_event(
            event_type="test_event",
            data={"test": "value"}
        )
        
        if "error" in log_result:
            print(f"ERROR: Failed to log event: {log_result['error']}")
        else:
            print(f"Log event created with ID: {log_result.get('$id')}")
            
            # Clean up - delete the test log
            log_id = log_result.get("$id")
            
            headers = {
                'X-Appwrite-Project': project_id,
                'X-Appwrite-Key': api_key,
                'Content-Type': 'application/json'
            }
            
            delete_response = requests.delete(
                f"{endpoint}/databases/{appwrite_service.database_id}/collections/{appwrite_service.logs_collection_id}/documents/{log_id}",
                headers=headers
            )
            
            if delete_response.status_code == 204:
                print("Successfully deleted test log")
            else:
                print(f"ERROR: Failed to delete test log. Status code: {delete_response.status_code}")
    
    except Exception as e:
        print(f"ERROR: Failed to test log event: {str(e)}")
    
    print("\nAppwriteService test completed!")
    return True

if __name__ == "__main__":
    success = asyncio.run(test_appwrite_service())
    sys.exit(0 if success else 1)
