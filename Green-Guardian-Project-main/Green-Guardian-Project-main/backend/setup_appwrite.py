import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_appwrite():
    """Set up Appwrite database and collections for GreenGuardian"""
    print("Setting up Appwrite for GreenGuardian...")
    
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
    
    # Create database
    try:
        print("\nCreating 'greenguardian' database...")
        response = requests.post(
            f"{endpoint}/databases",
            headers=headers,
            json={
                "databaseId": "greenguardian",
                "name": "GreenGuardian"
            }
        )
        
        if response.status_code == 201:
            print("Successfully created 'greenguardian' database")
            database_id = response.json().get('$id')
        elif response.status_code == 409:
            print("Database 'greenguardian' already exists")
            # Get the database ID
            response = requests.get(f"{endpoint}/databases", headers=headers)
            databases = response.json().get('databases', [])
            database_id = next((db.get('$id') for db in databases if db.get('name') == 'GreenGuardian'), None)
            if not database_id:
                print("ERROR: Could not find 'greenguardian' database ID")
                return False
        else:
            print(f"ERROR: Failed to create database. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"ERROR: Failed to create database: {str(e)}")
        return False
    
    # Create regions collection
    try:
        print("\nCreating 'regions' collection...")
        response = requests.post(
            f"{endpoint}/databases/{database_id}/collections",
            headers=headers,
            json={
                "collectionId": "regions",
                "name": "Regions",
                "permissions": ["read(\"any\")", "create(\"team\")", "update(\"team\")", "delete(\"team\")"]
            }
        )
        
        if response.status_code == 201:
            print("Successfully created 'regions' collection")
            
            # Create attributes for regions collection
            print("Creating attributes for 'regions' collection...")
            
            # Location attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/regions/attributes/string",
                headers=headers,
                json={
                    "key": "location",
                    "size": 255,
                    "required": True
                }
            )
            
            # Air quality attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/regions/attributes/object",
                headers=headers,
                json={
                    "key": "air_quality",
                    "required": False
                }
            )
            
            # Water quality attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/regions/attributes/object",
                headers=headers,
                json={
                    "key": "water_quality",
                    "required": False
                }
            )
            
            # Weather attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/regions/attributes/object",
                headers=headers,
                json={
                    "key": "weather",
                    "required": False
                }
            )
            
            print("Successfully created attributes for 'regions' collection")
            
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
                "permissions": ["read(\"user:{user_id}\")"]
            }
        )
        
        if response.status_code == 201:
            print("Successfully created 'user_preferences' collection")
            
            # Create attributes for user_preferences collection
            print("Creating attributes for 'user_preferences' collection...")
            
            # User ID attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/user_preferences/attributes/string",
                headers=headers,
                json={
                    "key": "user_id",
                    "size": 36,
                    "required": True
                }
            )
            
            # Preferences attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/user_preferences/attributes/object",
                headers=headers,
                json={
                    "key": "preferences",
                    "required": False
                }
            )
            
            print("Successfully created attributes for 'user_preferences' collection")
            
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
                "permissions": ["read(\"team\")", "create(\"any\")", "update(\"team\")", "delete(\"team\")"]
            }
        )
        
        if response.status_code == 201:
            print("Successfully created 'logs' collection")
            
            # Create attributes for logs collection
            print("Creating attributes for 'logs' collection...")
            
            # Event type attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/logs/attributes/string",
                headers=headers,
                json={
                    "key": "event_type",
                    "size": 255,
                    "required": True
                }
            )
            
            # Timestamp attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/logs/attributes/datetime",
                headers=headers,
                json={
                    "key": "timestamp",
                    "required": True
                }
            )
            
            # Data attribute
            requests.post(
                f"{endpoint}/databases/{database_id}/collections/logs/attributes/object",
                headers=headers,
                json={
                    "key": "data",
                    "required": False
                }
            )
            
            print("Successfully created attributes for 'logs' collection")
            
        elif response.status_code == 409:
            print("Collection 'logs' already exists")
        else:
            print(f"ERROR: Failed to create 'logs' collection. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to create 'logs' collection: {str(e)}")
    
    print("\nAppwrite setup completed!")
    return True

if __name__ == "__main__":
    success = setup_appwrite()
    sys.exit(0 if success else 1)
