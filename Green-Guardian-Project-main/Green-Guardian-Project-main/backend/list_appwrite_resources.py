import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def list_appwrite_resources():
    """List Appwrite resources"""
    print("Listing Appwrite resources...")
    
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
    
    # List databases
    try:
        print("\nListing databases...")
        response = requests.get(f"{endpoint}/databases", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {data.get('total', 0)} databases")
            
            if 'databases' in data and len(data['databases']) > 0:
                print("\nDatabases:")
                for db in data['databases']:
                    db_id = db.get('$id')
                    print(f"  - {db.get('name')} (ID: {db_id})")
                    
                    # List collections in this database
                    try:
                        collections_response = requests.get(f"{endpoint}/databases/{db_id}/collections", headers=headers)
                        if collections_response.status_code == 200:
                            collections_data = collections_response.json()
                            print(f"    Found {collections_data.get('total', 0)} collections")
                            
                            if 'collections' in collections_data and len(collections_data['collections']) > 0:
                                print("    Collections:")
                                for collection in collections_data['collections']:
                                    print(f"      - {collection.get('name')} (ID: {collection.get('$id')})")
                            else:
                                print("    No collections found")
                        else:
                            print(f"    ERROR: Failed to list collections. Status code: {collections_response.status_code}")
                    except Exception as e:
                        print(f"    ERROR: Failed to list collections: {str(e)}")
            else:
                print("No databases found")
        else:
            print(f"ERROR: Failed to list databases. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to list databases: {str(e)}")
    
    # List users
    try:
        print("\nListing users...")
        response = requests.get(f"{endpoint}/users", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {data.get('total', 0)} users")
        else:
            print(f"ERROR: Failed to list users. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to list users: {str(e)}")
    
    # List storage buckets
    try:
        print("\nListing storage buckets...")
        response = requests.get(f"{endpoint}/storage/buckets", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {data.get('total', 0)} storage buckets")
            
            if 'buckets' in data and len(data['buckets']) > 0:
                print("\nStorage buckets:")
                for bucket in data['buckets']:
                    print(f"  - {bucket.get('name')} (ID: {bucket.get('$id')})")
            else:
                print("No storage buckets found")
        else:
            print(f"ERROR: Failed to list storage buckets. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to list storage buckets: {str(e)}")
    
    print("\nAppwrite resources listing completed!")
    return True

if __name__ == "__main__":
    success = list_appwrite_resources()
    sys.exit(0 if success else 1)
