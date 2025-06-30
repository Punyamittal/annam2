from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime

class Coordinates(BaseModel):
    """Coordinates model for geographical locations"""
    lat: float = Field(..., description="Latitude")
    lon: float = Field(..., description="Longitude")

class AirQuality(BaseModel):
    """Air quality model"""
    aqi: int = Field(..., description="Air Quality Index")
    category: str = Field(..., description="AQI category (Good, Moderate, etc.)")
    pm25: float = Field(..., description="PM2.5 concentration (μg/m³)")
    pm10: Optional[float] = Field(None, description="PM10 concentration (μg/m³)")
    o3: Optional[float] = Field(None, description="Ozone concentration (ppb)")
    no2: Optional[float] = Field(None, description="Nitrogen dioxide concentration (ppb)")
    so2: Optional[float] = Field(None, description="Sulfur dioxide concentration (ppb)")
    co: Optional[float] = Field(None, description="Carbon monoxide concentration (ppm)")

class WaterQuality(BaseModel):
    """Water quality model"""
    status: str = Field(..., description="Overall water quality status")
    ph: Optional[float] = Field(None, description="pH level")
    turbidity: Optional[float] = Field(None, description="Turbidity (NTU)")
    dissolved_oxygen: Optional[float] = Field(None, description="Dissolved oxygen (mg/L)")
    contaminants: List[Dict[str, Any]] = Field(default_factory=list, description="List of contaminants")

class PollenCount(BaseModel):
    """Pollen count model"""
    tree_pollen: Dict[str, Any] = Field(..., description="Tree pollen data")
    grass_pollen: Dict[str, Any] = Field(..., description="Grass pollen data")
    weed_pollen: Dict[str, Any] = Field(..., description="Weed pollen data")
    mold: Optional[Dict[str, Any]] = Field(None, description="Mold spore data")
    overall: Dict[str, Any] = Field(..., description="Overall pollen assessment")

class Weather(BaseModel):
    """Weather model"""
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Humidity percentage")
    wind_speed: float = Field(..., description="Wind speed in m/s")
    wind_direction: int = Field(..., description="Wind direction in degrees")
    pressure: float = Field(..., description="Atmospheric pressure in hPa")
    description: str = Field(..., description="Weather description")
    icon: Optional[str] = Field(None, description="Weather icon code")

class EnvironmentalData(BaseModel):
    """Environmental data model for a region"""
    id: Optional[str] = Field(None, description="Region ID")
    name: str = Field(..., description="Region name")
    coordinates: Coordinates = Field(..., description="Region coordinates")
    air_quality: AirQuality = Field(..., description="Air quality data")
    water_quality: Optional[WaterQuality] = Field(None, description="Water quality data")
    uv_index: float = Field(..., description="UV index")
    pollen_count: Optional[PollenCount] = Field(None, description="Pollen count data")
    weather: Weather = Field(..., description="Weather data")
    timestamp: datetime = Field(..., description="Data timestamp")
    sources: List[str] = Field(default_factory=list, description="Data sources")
    data_confidence: str = Field(..., description="Data confidence level (High, Medium, Low)")

class RiskAssessment(BaseModel):
    """Risk assessment model"""
    overall_risk: Dict[str, Any] = Field(..., description="Overall risk assessment")
    specific_risks: List[Dict[str, Any]] = Field(..., description="Specific risk categories")
    trend: Dict[str, Any] = Field(..., description="Risk trend assessment")
    timestamp: datetime = Field(..., description="Assessment timestamp")

class Advice(BaseModel):
    """Environmental advice model"""
    general_advice: str = Field(..., description="General environmental advice")
    specific_recommendations: List[Dict[str, Any]] = Field(..., description="Specific recommendations")
    preventive_measures: List[str] = Field(..., description="Preventive measures")
    timestamp: datetime = Field(..., description="Advice timestamp")

class UserPreferences(BaseModel):
    """User preferences model"""
    user_id: str = Field(..., description="User ID")
    default_location: Optional[str] = Field(None, description="Default location")
    health_conditions: List[str] = Field(default_factory=list, description="Health conditions")
    notification_preferences: Dict[str, Any] = Field(default_factory=dict, description="Notification preferences")
    risk_thresholds: Dict[str, Any] = Field(default_factory=dict, description="Custom risk thresholds")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
