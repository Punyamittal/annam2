import os
import sys
import json
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_appwrite_collections():
    """Create collections in the existing greenguardian database"""
    print("Creating collections in the greenguardian database...")
    
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
    
    # Remove trailing slash if present
    if endpoint.endswith('/'):
        endpoint = endpoint[:-1]
    
    # Set up headers
    headers = {
        'X-Appwrite-Project': project_id,
        'X-Appwrite-Key': api_key,
        'Content-Type': 'application/json'
    }
    
    # Database ID is known
    database_id = "greenguardian"
    
    # Create regions collection
    try:
        print("\nCreating 'regions' collection...")
        response = requests.post(
            f"{endpoint}/databases/{database_id}/collections",
            headers=headers,
            json={
                "collectionId": "regions",
                "name": "Regions",
                "permissions": ["read(\"any\")"]
            }
        )
        
        if response.status_code == 201:
            print("Successfully created 'regions' collection")
            collection_id = response.json().get('$id')
            
            # Create attributes for regions collection
            print("Creating attributes for 'regions' collection...")
            
            # Location attribute
            location_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/string",
                headers=headers,
                json={
                    "key": "location",
                    "size": 255,
                    "required": True
                }
            )
            print(f"Location attribute created: {location_response.status_code == 202}")
            
            # Wait for attribute to be created
            time.sleep(2)
            
            # Air quality attribute
            air_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/object",
                headers=headers,
                json={
                    "key": "air_quality",
                    "required": False
                }
            )
            print(f"Air quality attribute created: {air_response.status_code == 202}")
            
            # Wait for attribute to be created
            time.sleep(2)
            
            # Water quality attribute
            water_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/object",
                headers=headers,
                json={
                    "key": "water_quality",
                    "required": False
                }
            )
            print(f"Water quality attribute created: {water_response.status_code == 202}")
            
            # Wait for attribute to be created
            time.sleep(2)
            
            # Weather attribute
            weather_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/object",
                headers=headers,
                json={
                    "key": "weather",
                    "required": False
                }
            )
            print(f"Weather attribute created: {weather_response.status_code == 202}")
            
        elif response.status_code == 409:
            print("Collection 'regions' already exists")
        else:
            print(f"ERROR: Failed to create 'regions' collection. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to create 'regions' collection: {str(e)}")
    
    # Create user_preferences collection
    try:
        print("\nCreating 'user_preferences' collection...")
        response = requests.post(
            f"{endpoint}/databases/{database_id}/collections",
            headers=headers,
            json={
                "collectionId": "user_preferences",
                "name": "User Preferences",
                "permissions": ["read(\"any\")"]
            }
        )
        
        if response.status_code == 201:
            print("Successfully created 'user_preferences' collection")
            collection_id = response.json().get('$id')
            
            # Create attributes for user_preferences collection
            print("Creating attributes for 'user_preferences' collection...")
            
            # User ID attribute
            user_id_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/string",
                headers=headers,
                json={
                    "key": "user_id",
                    "size": 36,
                    "required": True
                }
            )
            print(f"User ID attribute created: {user_id_response.status_code == 202}")
            
            # Wait for attribute to be created
            time.sleep(2)
            
            # Preferences attribute
            prefs_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/object",
                headers=headers,
                json={
                    "key": "preferences",
                    "required": False
                }
            )
            print(f"Preferences attribute created: {prefs_response.status_code == 202}")
            
        elif response.status_code == 409:
            print("Collection 'user_preferences' already exists")
        else:
            print(f"ERROR: Failed to create 'user_preferences' collection. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to create 'user_preferences' collection: {str(e)}")
    
    # Create logs collection
    try:
        print("\nCreating 'logs' collection...")
        response = requests.post(
            f"{endpoint}/databases/{database_id}/collections",
            headers=headers,
            json={
                "collectionId": "logs",
                "name": "Logs",
                "permissions": ["read(\"any\")"]
            }
        )
        
        if response.status_code == 201:
            print("Successfully created 'logs' collection")
            collection_id = response.json().get('$id')
            
            # Create attributes for logs collection
            print("Creating attributes for 'logs' collection...")
            
            # Event type attribute
            event_type_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/string",
                headers=headers,
                json={
                    "key": "event_type",
                    "size": 255,
                    "required": True
                }
            )
            print(f"Event type attribute created: {event_type_response.status_code == 202}")
            
            # Wait for attribute to be created
            time.sleep(2)
            
            # Timestamp attribute
            timestamp_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/datetime",
                headers=headers,
                json={
                    "key": "timestamp",
                    "required": True
                }
            )
            print(f"Timestamp attribute created: {timestamp_response.status_code == 202}")
            
            # Wait for attribute to be created
            time.sleep(2)
            
            # Data attribute
            data_response = requests.post(
                f"{endpoint}/databases/{database_id}/collections/{collection_id}/attributes/object",
                headers=headers,
                json={
                    "key": "data",
                    "required": False
                }
            )
            print(f"Data attribute created: {data_response.status_code == 202}")
            
        elif response.status_code == 409:
            print("Collection 'logs' already exists")
        else:
            print(f"ERROR: Failed to create 'logs' collection. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to create 'logs' collection: {str(e)}")
    
    print("\nAppwrite collections creation completed!")
    return True

if __name__ == "__main__":
    success = create_appwrite_collections()
    sys.exit(0 if success else 1)
