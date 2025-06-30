import os
import sys
import json
import asyncio
from dotenv import load_dotenv
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.users import Users
from appwrite.query import Query

# Load environment variables
load_dotenv()

async def test_appwrite_detailed():
    """Test Appwrite integration with detailed project information"""
    print("Testing Appwrite integration with detailed project information...")
    
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
    
    # Initialize Appwrite client
    try:
        client = Client()
        client.set_endpoint(endpoint)
        client.set_project(project_id)
        client.set_key(api_key)
        
        # Initialize services
        databases = Databases(client)
        users = Users(client)
        
        print("Appwrite client initialized successfully")
    except Exception as e:
        print(f"ERROR: Failed to initialize Appwrite client: {str(e)}")
        return False
    
    # List databases
    try:
        print("\nListing databases in the project...")
        db_list = databases.list()
        
        if "databases" in db_list and len(db_list["databases"]) > 0:
            print(f"Found {len(db_list['databases'])} databases:")
            for db in db_list["databases"]:
                print(f"  - {db['name']} (ID: {db['$id']})")
                
                # List collections in this database
                try:
                    collections = databases.list_collections(db["$id"])
                    if "collections" in collections and len(collections["collections"]) > 0:
                        print(f"    Collections in {db['name']}:")
                        for collection in collections["collections"]:
                            print(f"      - {collection['name']} (ID: {collection['$id']})")
                    else:
                        print(f"    No collections found in {db['name']}")
                except Exception as e:
                    print(f"    ERROR listing collections: {str(e)}")
        else:
            print("No databases found in the project")
            print("You need to create a database named 'greenguardian' with collections: 'regions', 'user_preferences', and 'logs'")
    except Exception as e:
        print(f"ERROR: Failed to list databases: {str(e)}")
    
    # Test user listing
    try:
        print("\nTesting user listing...")
        user_list = users.list()
        print(f"Found {user_list['total']} users in the project")
    except Exception as e:
        print(f"ERROR: Failed to list users: {str(e)}")
    
    print("\nAppwrite detailed integration test completed!")
    return True

if __name__ == "__main__":
    success = asyncio.run(test_appwrite_detailed())
    sys.exit(0 if success else 1)
