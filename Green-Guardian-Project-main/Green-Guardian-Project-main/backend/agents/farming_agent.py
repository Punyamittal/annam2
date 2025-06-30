    def _extract_simple_recommendations(self, search_results: Dict[str, Any], location: str, season: str) -> Dict[str, Any]:
        """
        Extract crop recommendations from search results without using LLM
        
        Args:
            search_results: Raw search results from Tavily
            location: Location string
            season: Season string
            
        Returns:
            Dictionary containing crop recommendations
        """
        # Initialize lists for different categories
        crops = []
        soil_tips = []
        climate_notes = []
        varieties = []
        
        # Extract information from search results
        for result in search_results.get("results", []):
            content = result.get("content", "").lower()
            
            # Look for crop mentions
            for crop in ["tomato", "corn", "wheat", "soybean", "lettuce", "kale", "spinach", 
                        "carrot", "potato", "onion", "garlic", "bean", "pea", "squash", 
                        "cucumber", "pepper", "eggplant", "broccoli", "cauliflower", 
                        "cabbage", "radish", "beet", "turnip", "strawberry", "blueberry",
                        "raspberry", "blackberry", "apple", "peach", "pear", "plum", 
                        "cherry", "grape", "watermelon", "cantaloupe", "pumpkin"]:
                if crop in content and not any(c.get("name", "").lower() == crop for c in crops):
                    crops.append({
                        "name": crop.title() + ("es" if crop.endswith("o") else "s"),
                        "description": f"Commonly grown in {location}",
                        "planting_time": f"{season.title()} planting recommended"
                    })
                    if len(crops) >= 3:
                        break
            
            # Look for soil preparation tips
            if "soil" in content:
                sentences = content.split(".")
                for sentence in sentences:
                    if "soil" in sentence and len(sentence) > 15 and len(soil_tips) < 3:
                        cleaned = sentence.strip().capitalize()
                        if cleaned and not any(tip == cleaned for tip in soil_tips):
                            soil_tips.append(cleaned)
            
            # Look for climate considerations
            if "climate" in content or "weather" in content or "temperature" in content:
                sentences = content.split(".")
                for sentence in sentences:
                    if any(word in sentence for word in ["climate", "weather", "temperature", "frost", "rain"]) and len(sentence) > 15 and len(climate_notes) < 3:
                        cleaned = sentence.strip().capitalize()
                        if cleaned and not any(note == cleaned for note in climate_notes):
                            climate_notes.append(cleaned)
            
            # Look for variety mentions
            if "variety" in content or "varieties" in content:
                sentences = content.split(".")
                for sentence in sentences:
                    if "variety" in sentence or "varieties" in sentence:
                        cleaned = sentence.strip().capitalize()
                        if cleaned and len(varieties) < 2:
                            varieties.append(cleaned)
        
        # If we didn't find enough information, add some defaults
        if len(crops) < 3:
            default_recs = self._create_default_crop_recommendations(location, season)
            while len(crops) < 3:
                if len(default_recs["recommended_crops"]) > len(crops) - 1:
                    crops.append(default_recs["recommended_crops"][len(crops)])
                else:
                    break
        
        if not soil_tips:
            soil_tips = ["Test soil pH and amend as needed", 
                        "Add compost to improve soil structure", 
                        "Ensure good drainage"]
        
        if not climate_notes:
            climate_notes = ["Consider local frost dates", 
                            "Plan for seasonal rainfall patterns", 
                            "Be aware of typical temperature ranges"]
        
        if not varieties:
            varieties = [f"Check with local extension office for {location}-specific recommendations"]
        
        # Construct the response
        return {
            "location": location,
            "season": season,
            "recommended_crops": crops[:3],  # Limit to 3 crops
            "soil_preparation": soil_tips[:3],  # Limit to 3 tips
            "climate_considerations": climate_notes[:3],  # Limit to 3 notes
            "local_varieties": varieties[:2]  # Limit to 2 variety notes
        }
