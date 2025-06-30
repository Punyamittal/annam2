from typing import Dict, Any, List, Optional
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.users import Users
from appwrite.query import Query

class AppwriteService:
    """
    Service for interacting with Appwrite for user management and data storage
    """
    
    def __init__(self, endpoint: str, project_id: str, api_key: str):
        """
        Initialize Appwrite service
        
        Args:
            endpoint: Appwrite endpoint URL
            project_id: Appwrite project ID
            api_key: Appwrite API key
        """
        self.client = Client()
        self.client.set_endpoint(endpoint)
        self.client.set_project(project_id)
        self.client.set_key(api_key)
        
        # Initialize services
        self.databases = Databases(self.client)
        self.users = Users(self.client)
        
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
            return self.users.get(user_id)
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
            return self.users.create(
                user_id="unique()",
                email=email,
                password=password,
                name=name
            )
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
            return self.databases.get_document(
                database_id=self.database_id,
                collection_id=self.regions_collection_id,
                document_id=region_id
            )
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
            return self.databases.list_documents(
                database_id=self.database_id,
                collection_id=self.regions_collection_id,
                queries=[
                    Query.limit(10)
                ]
            ).get("documents", [])
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
            return self.databases.create_document(
                database_id=self.database_id,
                collection_id=self.regions_collection_id,
                document_id="unique()",
                data=region_data
            )
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
            return self.databases.update_document(
                database_id=self.database_id,
                collection_id=self.regions_collection_id,
                document_id=region_id,
                data=region_data
            )
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
            return self.databases.list_documents(
                database_id=self.database_id,
                collection_id=self.user_preferences_collection_id,
                queries=[
                    Query.equal("user_id", user_id)
                ]
            ).get("documents", [{}])[0]
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
                return self.databases.create_document(
                    database_id=self.database_id,
                    collection_id=self.user_preferences_collection_id,
                    document_id="unique()",
                    data={
                        "user_id": user_id,
                        **preferences
                    }
                )
            else:
                # Update existing preferences
                return self.databases.update_document(
                    database_id=self.database_id,
                    collection_id=self.user_preferences_collection_id,
                    document_id=existing_prefs.get("$id"),
                    data=preferences
                )
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
            return self.databases.create_document(
                database_id=self.database_id,
                collection_id=self.logs_collection_id,
                document_id="unique()",
                data={
                    "event_type": event_type,
                    "timestamp": "now()",
                    "data": data
                }
            )
        except Exception as e:
            print(f"Error logging event: {str(e)}")
            return {"error": str(e)}
