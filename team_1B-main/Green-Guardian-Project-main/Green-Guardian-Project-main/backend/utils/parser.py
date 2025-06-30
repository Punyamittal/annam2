import re
from typing import Dict, Any, List, Optional
from bs4 import BeautifulSoup
import json

class Parser:
    """
    Utility class for parsing and cleaning HTML content and extracting structured data
    """
    
    @staticmethod
    def clean_html(html_content: str) -> str:
        """
        Clean HTML content by removing scripts, styles, and unnecessary tags
        
        Args:
            html_content: Raw HTML content
            
        Returns:
            Cleaned text content
        """
        # Parse HTML
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove script and style elements
        for script_or_style in soup(['script', 'style', 'header', 'footer', 'nav']):
            script_or_style.decompose()
        
        # Get text content
        text = soup.get_text()
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text
    
    @staticmethod
    def extract_air_quality_data(html_content: str) -> Dict[str, Any]:
        """
        Extract air quality data from HTML content
        
        Args:
            html_content: HTML content containing air quality data
            
        Returns:
            Dictionary containing structured air quality data
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Initialize result dictionary
        result = {
            "aqi": None,
            "category": "Unknown",
            "pm25": None,
            "pm10": None,
            "o3": None,
            "no2": None,
            "so2": None,
            "co": None
        }
        
        # Try to find AQI value
        aqi_pattern = r'AQI:?\s*(\d+)'
        aqi_match = re.search(aqi_pattern, html_content)
        if aqi_match:
            result["aqi"] = int(aqi_match.group(1))
        
        # Try to find AQI category
        categories = ["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"]
        for category in categories:
            if category.lower() in html_content.lower():
                result["category"] = category
                break
        
        # Try to find PM2.5 value
        pm25_pattern = r'PM2\.5:?\s*([\d.]+)'
        pm25_match = re.search(pm25_pattern, html_content)
        if pm25_match:
            result["pm25"] = float(pm25_match.group(1))
        
        # Try to find PM10 value
        pm10_pattern = r'PM10:?\s*([\d.]+)'
        pm10_match = re.search(pm10_pattern, html_content)
        if pm10_match:
            result["pm10"] = float(pm10_match.group(1))
        
        # Try to find Ozone value
        o3_pattern = r'O3|Ozone:?\s*([\d.]+)'
        o3_match = re.search(o3_pattern, html_content)
        if o3_match:
            result["o3"] = float(o3_match.group(1))
        
        # Try to find NO2 value
        no2_pattern = r'NO2:?\s*([\d.]+)'
        no2_match = re.search(no2_pattern, html_content)
        if no2_match:
            result["no2"] = float(no2_match.group(1))
        
        # Try to find SO2 value
        so2_pattern = r'SO2:?\s*([\d.]+)'
        so2_match = re.search(so2_pattern, html_content)
        if so2_match:
            result["so2"] = float(so2_match.group(1))
        
        # Try to find CO value
        co_pattern = r'CO:?\s*([\d.]+)'
        co_match = re.search(co_pattern, html_content)
        if co_match:
            result["co"] = float(co_match.group(1))
        
        return result
    
    @staticmethod
    def extract_water_quality_data(html_content: str) -> Dict[str, Any]:
        """
        Extract water quality data from HTML content
        
        Args:
            html_content: HTML content containing water quality data
            
        Returns:
            Dictionary containing structured water quality data
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Initialize result dictionary
        result = {
            "status": "Unknown",
            "ph": None,
            "turbidity": None,
            "dissolved_oxygen": None,
            "contaminants": []
        }
        
        # Try to find water quality status
        statuses = ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
        for status in statuses:
            if status.lower() in html_content.lower():
                result["status"] = status
                break
        
        # Try to find pH value
        ph_pattern = r'pH:?\s*([\d.]+)'
        ph_match = re.search(ph_pattern, html_content)
        if ph_match:
            result["ph"] = float(ph_match.group(1))
        
        # Try to find turbidity value
        turbidity_pattern = r'Turbidity:?\s*([\d.]+)'
        turbidity_match = re.search(turbidity_pattern, html_content)
        if turbidity_match:
            result["turbidity"] = float(turbidity_match.group(1))
        
        # Try to find dissolved oxygen value
        do_pattern = r'Dissolved Oxygen:?\s*([\d.]+)'
        do_match = re.search(do_pattern, html_content)
        if do_match:
            result["dissolved_oxygen"] = float(do_match.group(1))
        
        # Try to find contaminants
        contaminants = []
        common_contaminants = ["Lead", "Mercury", "Arsenic", "Nitrates", "E. coli", "Chlorine"]
        for contaminant in common_contaminants:
            if contaminant.lower() in html_content.lower():
                # Try to find value
                value_pattern = rf'{contaminant}:?\s*([\d.]+)'
                value_match = re.search(value_pattern, html_content)
                value = float(value_match.group(1)) if value_match else None
                
                contaminants.append({
                    "name": contaminant,
                    "value": value,
                    "unit": "ppm"  # Default unit
                })
        
        result["contaminants"] = contaminants
        
        return result
    
    @staticmethod
    def extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
        """
        Extract JSON object from text
        
        Args:
            text: Text that may contain a JSON object
            
        Returns:
            Extracted JSON object or None if not found
        """
        # Try to find JSON object in text
        json_pattern = r'({[\s\S]*})'
        json_match = re.search(json_pattern, text)
        
        if json_match:
            json_str = json_match.group(1)
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                # Try to clean up the JSON string
                # Remove any non-JSON content
                cleaned_json = re.sub(r'```json|```', '', json_str)
                try:
                    return json.loads(cleaned_json)
                except json.JSONDecodeError:
                    return None
        
        return None
