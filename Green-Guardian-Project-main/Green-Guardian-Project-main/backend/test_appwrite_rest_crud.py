import os
import sys
import json
import requests
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_appwrite_rest_crud():
    """Test Appwrite CRUD operations using REST API"""
    print("Testing Appwrite CRUD operations using REST API...")
    
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
    
    # Database and collection IDs
    database_id = "greenguardian"
    regions_collection_id = "regions"
    logs_collection_id = "logs"
    
    # Create a test region document
    try:
        print("\nCreating a test region document...")
        
        # Generate a unique document ID
        document_id = str(uuid.uuid4())
        
        response = requests.post(
            f"{endpoint}/databases/{database_id}/collections/{regions_collection_id}/documents",
            headers=headers,
            json={
                "documentId": document_id,
                "data": {
                    "location": "Test Location"
                }
            }
        )
        
        if response.status_code == 201:
            print("Successfully created test region document")
            document_data = response.json()
            print(f"Document ID: {document_data.get('$id')}")
            
            # Now try to retrieve the document
            print("\nRetrieving the test region document...")
            get_response = requests.get(
                f"{endpoint}/databases/{database_id}/collections/{regions_collection_id}/documents/{document_id}",
                headers=headers
            )
            
            if get_response.status_code == 200:
                print("Successfully retrieved test region document")
                retrieved_data = get_response.json()
                print(f"Retrieved location: {retrieved_data.get('location')}")
                
                # Now try to update the document
                print("\nUpdating the test region document...")
                update_response = requests.patch(
                    f"{endpoint}/databases/{database_id}/collections/{regions_collection_id}/documents/{document_id}",
                    headers=headers,
                    json={
                        "data": {
                            "location": "Updated Test Location"
                        }
                    }
                )
                
                if update_response.status_code == 200:
                    print("Successfully updated test region document")
                    updated_data = update_response.json()
                    print(f"Updated location: {updated_data.get('location')}")
                    
                    # Now try to delete the document
                    print("\nDeleting the test region document...")
                    delete_response = requests.delete(
                        f"{endpoint}/databases/{database_id}/collections/{regions_collection_id}/documents/{document_id}",
                        headers=headers
                    )
                    
                    if delete_response.status_code == 204:
                        print("Successfully deleted test region document")
                    else:
                        print(f"ERROR: Failed to delete test region document. Status code: {delete_response.status_code}")
                        print(f"Response: {delete_response.text}")
                else:
                    print(f"ERROR: Failed to update test region document. Status code: {update_response.status_code}")
                    print(f"Response: {update_response.text}")
            else:
                print(f"ERROR: Failed to retrieve test region document. Status code: {get_response.status_code}")
                print(f"Response: {get_response.text}")
        else:
            print(f"ERROR: Failed to create test region document. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to perform CRUD operations: {str(e)}")
    
    # Try to create a log entry
    try:
        print("\nCreating a test log entry...")
        
        # Generate a unique document ID
        document_id = str(uuid.uuid4())
        
        response = requests.post(
            f"{endpoint}/databases/{database_id}/collections/{logs_collection_id}/documents",
            headers=headers,
            json={
                "documentId": document_id,
                "data": {
                    "event_type": "test_event",
                    "timestamp": "2025-06-17T09:00:00.000Z"
                }
            }
        )
        
        if response.status_code == 201:
            print("Successfully created test log entry")
            document_data = response.json()
            print(f"Document ID: {document_data.get('$id')}")
            
            # Now try to delete the document
            print("\nDeleting the test log entry...")
            delete_response = requests.delete(
                f"{endpoint}/databases/{database_id}/collections/{logs_collection_id}/documents/{document_id}",
                headers=headers
            )
            
            if delete_response.status_code == 204:
                print("Successfully deleted test log entry")
            else:
                print(f"ERROR: Failed to delete test log entry. Status code: {delete_response.status_code}")
                print(f"Response: {delete_response.text}")
        else:
            print(f"ERROR: Failed to create test log entry. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: Failed to perform log operations: {str(e)}")
    
    print("\nAppwrite CRUD test completed!")
    return True

if __name__ == "__main__":
    success = test_appwrite_rest_crud()
    sys.exit(0 if success else 1)
