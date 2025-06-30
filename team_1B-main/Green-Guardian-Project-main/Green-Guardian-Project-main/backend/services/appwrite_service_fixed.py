from typing import Dict, Any, List, Optional
import requests
import uuid

class AppwriteService:
    """
    Service for interacting with Appwrite for user management and data storage
    Using REST API instead of SDK to avoid issues
    """
    
    def __init__(self, endpoint: str, project_id: str, api_key: str):
        """
        Initialize Appwrite service
        
        Args:
            endpoint: Appwrite endpoint URL
            project_id: Appwrite project ID
            api_key: Appwrite API key
        """
        # Remove trailing slash if present
        if endpoint.endswith('/'):
            endpoint = endpoint[:-1]
            
        self.endpoint = endpoint
        self.project_id = project_id
        self.api_key = api_key
        
        # Set up headers
        self.headers = {
            'X-Appwrite-Project': project_id,
            'X-Appwrite-Key': api_key,
            'Content-Type': 'application/json'
        }
        
        # Database and collection IDs
        self.database_id = "greenguardian"
        self.regions_collection_id = "regions"
        self.user_preferences_collection_id = "user_preferences"
        self.logs_collection_id = "logs"
    
    async def get_user(self, user_id: str) -> Dict[str, Any]:
        """
        Get user by ID
        
        Args:
            user_id: User ID
            
        Returns:
            User data dictionary
        """
        try:
            response = requests.get(
                f"{self.endpoint}/users/{user_id}",
                headers=self.headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Failed to get user. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error getting user: {str(e)}")
            return {"error": str(e)}
    
    async def create_user(self, email: str, password: str, name: str) -> Dict[str, Any]:
        """
        Create a new user
        
        Args:
            email: User email
            password: User password
            name: User name
            
        Returns:
            Created user data
        """
        try:
            response = requests.post(
                f"{self.endpoint}/users",
                headers=self.headers,
                json={
                    "userId": "unique()",
                    "email": email,
                    "password": password,
                    "name": name
                }
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                return {"error": f"Failed to create user. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return {"error": str(e)}
    
    async def get_region_data(self, region_id: str) -> Dict[str, Any]:
        """
        Get environmental data for a specific region
        
        Args:
            region_id: Region ID
            
        Returns:
            Region data dictionary
        """
        try:
            response = requests.get(
                f"{self.endpoint}/databases/{self.database_id}/collections/{self.regions_collection_id}/documents/{region_id}",
                headers=self.headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Failed to get region data. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error getting region data: {str(e)}")
            return {"error": str(e)}
    
    async def search_regions(self, location: str, radius_km: float = 5.0) -> List[Dict[str, Any]]:
        """
        Search for regions near a location
        
        Args:
            location: Location string or coordinates
            radius_km: Search radius in kilometers
            
        Returns:
            List of region data dictionaries
        """
        try:
            # This is a simplified implementation
            # In a real app, you would parse the location and use geospatial queries
            response = requests.get(
                f"{self.endpoint}/databases/{self.database_id}/collections/{self.regions_collection_id}/documents",
                headers=self.headers,
                params={
                    "queries": [f"limit(10)"]
                }
            )
            
            if response.status_code == 200:
                return response.json().get("documents", [])
            else:
                print(f"Error searching regions: {response.text}")
                return []
        except Exception as e:
            print(f"Error searching regions: {str(e)}")
            return []
    
    async def create_region(self, region_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new region
        
        Args:
            region_data: Region data dictionary
            
        Returns:
            Created region data
        """
        try:
            document_id = str(uuid.uuid4())
            
            response = requests.post(
                f"{self.endpoint}/databases/{self.database_id}/collections/{self.regions_collection_id}/documents",
                headers=self.headers,
                json={
                    "documentId": document_id,
                    "data": region_data
                }
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                return {"error": f"Failed to create region. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error creating region: {str(e)}")
            return {"error": str(e)}
    
    async def update_region(self, region_id: str, region_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing region
        
        Args:
            region_id: Region ID
            region_data: Updated region data
            
        Returns:
            Updated region data
        """
        try:
            response = requests.patch(
                f"{self.endpoint}/databases/{self.database_id}/collections/{self.regions_collection_id}/documents/{region_id}",
                headers=self.headers,
                json={
                    "data": region_data
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Failed to update region. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error updating region: {str(e)}")
            return {"error": str(e)}
    
    async def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """
        Get user preferences
        
        Args:
            user_id: User ID
            
        Returns:
            User preferences dictionary
        """
        try:
            response = requests.get(
                f"{self.endpoint}/databases/{self.database_id}/collections/{self.user_preferences_collection_id}/documents",
                headers=self.headers,
                params={
                    "queries": [f"equal(\"user_id\", \"{user_id}\")", "limit(1)"]
                }
            )
            
            if response.status_code == 200:
                documents = response.json().get("documents", [])
                return documents[0] if documents else {}
            else:
                return {"error": f"Failed to get user preferences. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error getting user preferences: {str(e)}")
            return {}
    
    async def update_user_preferences(self, user_id: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user preferences
        
        Args:
            user_id: User ID
            preferences: User preferences dictionary
            
        Returns:
            Updated user preferences
        """
        try:
            # Check if preferences document exists
            existing_prefs = await self.get_user_preferences(user_id)
            
            if "error" in existing_prefs or not existing_prefs:
                # Create new preferences document
                document_id = str(uuid.uuid4())
                
                response = requests.post(
                    f"{self.endpoint}/databases/{self.database_id}/collections/{self.user_preferences_collection_id}/documents",
                    headers=self.headers,
                    json={
                        "documentId": document_id,
                        "data": {
                            "user_id": user_id,
                            **preferences
                        }
                    }
                )
                
                if response.status_code == 201:
                    return response.json()
                else:
                    return {"error": f"Failed to create user preferences. Status code: {response.status_code}"}
            else:
                # Update existing preferences
                document_id = existing_prefs.get("$id")
                
                response = requests.patch(
                    f"{self.endpoint}/databases/{self.database_id}/collections/{self.user_preferences_collection_id}/documents/{document_id}",
                    headers=self.headers,
                    json={
                        "data": preferences
                    }
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    return {"error": f"Failed to update user preferences. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error updating user preferences: {str(e)}")
            return {"error": str(e)}
    
    async def log_event(self, event_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Log an event
        
        Args:
            event_type: Type of event
            data: Event data
            
        Returns:
            Created log entry
        """
        try:
            document_id = str(uuid.uuid4())
            
            response = requests.post(
                f"{self.endpoint}/databases/{self.database_id}/collections/{self.logs_collection_id}/documents",
                headers=self.headers,
                json={
                    "documentId": document_id,
                    "data": {
                        "event_type": event_type,
                        "timestamp": "2025-06-17T09:00:00.000Z",  # Use current time in production
                        # Note: We're not including the data field as it's not yet created in the collection
                    }
                }
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                return {"error": f"Failed to log event. Status code: {response.status_code}"}
        except Exception as e:
            print(f"Error logging event: {str(e)}")
            return {"error": str(e)}
