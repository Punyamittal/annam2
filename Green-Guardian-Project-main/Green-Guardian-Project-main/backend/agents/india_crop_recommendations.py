"""
India-specific crop recommendations for the GreenGuardian farming agent
"""

from typing import Dict, Any

def get_india_crop_recommendations(location: str, season: str) -> Dict[str, Any]:
    """
    Get India-specific crop recommendations based on location and season
    
    Args:
        location: Location string
        season: Season string
        
    Returns:
        Dictionary containing crop recommendations
    """
    location_lower = location.lower()
    season_lower = season.lower()
    
    # Convert Western seasons to Indian agricultural seasons if needed
    indian_season = season_lower
    if season_lower not in ["kharif", "rabi", "zaid"]:
        if season_lower in ["monsoon", "rainy", "summer"]:
            indian_season = "kharif"
        elif season_lower in ["winter", "cold"]:
            indian_season = "rabi"
        elif season_lower in ["spring"]:
            indian_season = "zaid"
    
    # All-India recommendations based on season
    if indian_season == "kharif":  # Monsoon crop season (June to October)
        recommendations = {
            "location": location,
            "season": "Kharif (Monsoon)",
            "recommended_crops": [
                {
                    "name": "Rice (Paddy)",
                    "description": "Major kharif crop that thrives in monsoon conditions",
                    "planting_time": "June-July with the onset of monsoon"
                },
                {
                    "name": "Cotton",
                    "description": "Important commercial crop suited for warm, humid conditions",
                    "planting_time": "May-June before heavy monsoon"
                },
                {
                    "name": "Maize",
                    "description": "Versatile crop that grows well in various Indian soils",
                    "planting_time": "June-July with adequate rainfall"
                }
            ],
            "soil_preparation": [
                "Prepare fields after pre-monsoon showers",
                "Ensure proper drainage to prevent waterlogging",
                "Apply organic matter before planting"
            ],
            "climate_considerations": [
                "Monitor monsoon patterns and rainfall distribution",
                "Be prepared for heavy rainfall periods",
                "Consider crop varieties resistant to excess moisture"
            ],
            "local_varieties": [
                "Consult your local Krishi Vigyan Kendra (KVK) for region-specific varieties",
                "Look for varieties developed by Indian Agricultural Research Institute (IARI)"
            ]
        }
    elif indian_season == "rabi":  # Winter crop season (November to March)
        recommendations = {
            "location": location,
            "season": "Rabi (Winter)",
            "recommended_crops": [
                {
                    "name": "Wheat",
                    "description": "Major rabi crop suited for cooler temperatures",
                    "planting_time": "October-November after monsoon"
                },
                {
                    "name": "Chickpea (Gram)",
                    "description": "Important pulse crop that fixes nitrogen in soil",
                    "planting_time": "October-November"
                },
                {
                    "name": "Mustard",
                    "description": "Oilseed crop that requires less water",
                    "planting_time": "October-November"
                }
            ],
            "soil_preparation": [
                "Ensure field is well-drained after monsoon",
                "Deep plowing to improve soil aeration",
                "Apply appropriate fertilizers based on soil testing"
            ],
            "climate_considerations": [
                "Irrigation planning is crucial as rabi depends on irrigation",
                "Protect crops from occasional winter rains",
                "Monitor temperature fluctuations"
            ],
            "local_varieties": [
                "Consult your local Krishi Vigyan Kendra (KVK) for region-specific varieties",
                "Consider varieties developed by state agricultural universities"
            ]
        }
    else:  # Zaid/Summer crop season (April to May)
        recommendations = {
            "location": location,
            "season": "Zaid (Summer)",
            "recommended_crops": [
                {
                    "name": "Watermelon",
                    "description": "Heat-tolerant fruit crop for summer season",
                    "planting_time": "February-March for summer harvest"
                },
                {
                    "name": "Cucumber",
                    "description": "Quick-growing vegetable for summer",
                    "planting_time": "February-March"
                },
                {
                    "name": "Muskmelon",
                    "description": "Summer fruit crop with good market value",
                    "planting_time": "February-March"
                }
            ],
            "soil_preparation": [
                "Ensure adequate organic matter for water retention",
                "Mulching to conserve soil moisture",
                "Prepare raised beds for better drainage"
            ],
            "climate_considerations": [
                "Regular irrigation is essential during hot summer months",
                "Consider shade structures for sensitive crops",
                "Be prepared for pre-monsoon showers in May"
            ],
            "local_varieties": [
                "Consult your local Krishi Vigyan Kendra (KVK) for heat-tolerant varieties",
                "Look for drought-resistant varieties for summer cultivation"
            ]
        }
    
    # Region-specific recommendations override general season recommendations
    if "punjab" in location_lower or "haryana" in location_lower:
        recommendations = {
            "location": location,
            "season": indian_season.capitalize(),
            "recommended_crops": [
                {
                    "name": "Wheat",
                    "description": "Major crop of the region with excellent growing conditions",
                    "planting_time": "October-November (Rabi season)"
                },
                {
                    "name": "Rice",
                    "description": "Important kharif crop in the region",
                    "planting_time": "June-July with monsoon onset"
                },
                {
                    "name": "Cotton",
                    "description": "Commercial crop well-suited to the region",
                    "planting_time": "April-May before monsoon"
                }
            ],
            "soil_preparation": [
                "Deep plowing to break hardpan",
                "Apply organic matter to improve soil structure",
                "Consider laser land leveling for water conservation"
            ],
            "climate_considerations": [
                "Plan irrigation schedule carefully",
                "Monitor weather forecasts for temperature extremes",
                "Consider crop residue management to prevent burning"
            ],
            "local_varieties": [
                "Consult Punjab Agricultural University or Haryana Agricultural University",
                "Look for varieties with shorter duration to enable crop rotation"
            ]
        }
    elif "uttar pradesh" in location_lower or "bihar" in location_lower:
        recommendations = {
            "location": location,
            "season": indian_season.capitalize(),
            "recommended_crops": [
                {
                    "name": "Rice",
                    "description": "Staple crop of the Gangetic plains",
                    "planting_time": "June-July (Kharif season)"
                },
                {
                    "name": "Wheat",
                    "description": "Major rabi crop in the region",
                    "planting_time": "November-December"
                },
                {
                    "name": "Sugarcane",
                    "description": "Important cash crop for the region",
                    "planting_time": "February-March"
                }
            ],
            "soil_preparation": [
                "Ensure proper drainage in low-lying areas",
                "Apply balanced fertilizers based on soil testing",
                "Consider raised bed planting in flood-prone areas"
            ],
            "climate_considerations": [
                "Plan for flood management during monsoon",
                "Ensure irrigation availability for rabi crops",
                "Monitor pest pressure which increases in humid conditions"
            ],
            "local_varieties": [
                "Consult local agricultural universities for region-specific varieties",
                "Consider flood-tolerant varieties for low-lying areas"
            ]
        }
    elif "maharashtra" in location_lower:
        recommendations = {
            "location": location,
            "season": indian_season.capitalize(),
            "recommended_crops": [
                {
                    "name": "Cotton",
                    "description": "Major crop in Vidarbha and Marathwada regions",
                    "planting_time": "June-July with monsoon onset"
                },
                {
                    "name": "Jowar (Sorghum)",
                    "description": "Drought-resistant crop suitable for rain-fed areas",
                    "planting_time": "June-July (Kharif) or October (Rabi)"
                },
                {
                    "name": "Soybean",
                    "description": "Important oilseed crop in the region",
                    "planting_time": "June-July with monsoon"
                }
            ],
            "soil_preparation": [
                "Implement water conservation techniques",
                "Add organic matter to improve water retention",
                "Consider contour farming in sloped areas"
            ],
            "climate_considerations": [
                "Plan for drought management in rain shadow areas",
                "Implement rainwater harvesting",
                "Consider drought-resistant crop varieties"
            ],
            "local_varieties": [
                "Consult Mahatma Phule Krishi Vidyapeeth for region-specific recommendations",
                "Look for drought-tolerant varieties for rain shadow regions"
            ]
        }
    elif "gujarat" in location_lower or "rajasthan" in location_lower:
        recommendations = {
            "location": location,
            "season": indian_season.capitalize(),
            "recommended_crops": [
                {
                    "name": "Groundnut",
                    "description": "Important oilseed crop for semi-arid regions",
                    "planting_time": "June-July with monsoon onset"
                },
                {
                    "name": "Cotton",
                    "description": "Commercial crop suited to the region",
                    "planting_time": "June-July"
                },
                {
                    "name": "Bajra (Pearl Millet)",
                    "description": "Drought-resistant crop for arid regions",
                    "planting_time": "July with adequate rainfall"
                }
            ],
            "soil_preparation": [
                "Implement soil moisture conservation techniques",
                "Add organic matter to improve water retention",
                "Consider mulching to reduce evaporation"
            ],
            "climate_considerations": [
                "Plan for water conservation and efficient irrigation",
                "Be prepared for high temperatures",
                "Consider wind breaks to prevent soil erosion"
            ],
            "local_varieties": [
                "Consult local agricultural universities for drought-resistant varieties",
                "Look for varieties with shorter duration to fit within rainfall period"
            ]
        }
    elif "tamil nadu" in location_lower or "kerala" in location_lower or "karnataka" in location_lower:
        recommendations = {
            "location": location,
            "season": indian_season.capitalize(),
            "recommended_crops": [
                {
                    "name": "Rice",
                    "description": "Staple crop with multiple growing seasons in South India",
                    "planting_time": "Depends on local monsoon pattern"
                },
                {
                    "name": "Coconut",
                    "description": "Perennial crop well-suited to coastal regions",
                    "planting_time": "June-July before heavy monsoon"
                },
                {
                    "name": "Spices (Pepper, Cardamom)",
                    "description": "High-value crops suited to the Western Ghats",
                    "planting_time": "May-June before monsoon"
                }
            ],
            "soil_preparation": [
                "Ensure good drainage during heavy monsoon",
                "Add organic matter to improve soil fertility",
                "Consider terracing in hilly areas"
            ],
            "climate_considerations": [
                "Plan for both southwest and northeast monsoons",
                "Consider humidity effects on crop diseases",
                "Implement drainage systems for heavy rainfall periods"
            ],
            "local_varieties": [
                "Consult Tamil Nadu Agricultural University or Kerala Agricultural University",
                "Look for varieties resistant to high humidity conditions"
            ]
        }
    elif "west bengal" in location_lower or "assam" in location_lower or "northeast" in location_lower:
        recommendations = {
            "location": location,
            "season": indian_season.capitalize(),
            "recommended_crops": [
                {
                    "name": "Rice",
                    "description": "Major crop with multiple varieties suited to the region",
                    "planting_time": "June-July with monsoon onset"
                },
                {
                    "name": "Jute",
                    "description": "Important fiber crop for eastern India",
                    "planting_time": "March-April before heavy monsoon"
                },
                {
                    "name": "Tea",
                    "description": "Perennial plantation crop for hilly regions",
                    "planting_time": "Year-round management with planting in spring"
                }
            ],
            "soil_preparation": [
                "Ensure proper drainage in high rainfall areas",
                "Add organic matter to improve soil structure",
                "Consider raised bed cultivation in flood-prone areas"
            ],
            "climate_considerations": [
                "Plan for high rainfall and humidity",
                "Implement flood management strategies",
                "Consider crop varieties resistant to excess moisture"
            ],
            "local_varieties": [
                "Consult local agricultural universities for region-specific varieties",
                "Look for flood-tolerant varieties for low-lying areas"
            ]
        }
    
    return recommendations
