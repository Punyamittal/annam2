import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_appwrite_rest():
    """Test Appwrite integration using REST API"""
    print("Testing Appwrite integration using REST API...")
    
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
    
    # Test connection by listing databases
    try:
        print("\nListing databases...")
        response = requests.get(f"{endpoint}/databases", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Successfully connected to Appwrite")
            print(f"Found {data.get('total', 0)} databases")
            
            if 'databases' in data and len(data['databases']) > 0:
                print("\nDatabases:")
                for db in data['databases']:
                    print(f"  - {db.get('name')} (ID: {db.get('$id')})")
            else:
                print("\nNo databases found. You need to create a database named 'greenguardian'")
        else:
            print(f"ERROR: Failed to list databases. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to connect to Appwrite: {str(e)}")
        return False
    
    # Test listing users
    try:
        print("\nListing users...")
        response = requests.get(f"{endpoint}/users", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Successfully listed users")
            print(f"Found {data.get('total', 0)} users")
        else:
            print(f"ERROR: Failed to list users. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to list users: {str(e)}")
    
    print("\nAppwrite REST API test completed!")
    return True

if __name__ == "__main__":
    success = test_appwrite_rest()
    sys.exit(0 if success else 1)
