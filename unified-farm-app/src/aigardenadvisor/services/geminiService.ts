import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface CropRecommendationRequest {
  location: string;
  gardenSize: 'Small' | 'Medium' | 'Large';
  cropType: 'Vegetables' | 'Flowers' | 'Herbs' | 'Mixed';
  season?: string;
  // Enhanced fields
  soilType: 'Clay' | 'Sandy' | 'Loamy' | 'Silty' | 'Rocky' | 'Unknown';
  sunExposure: 'Full Sun' | 'Partial Sun' | 'Partial Shade' | 'Full Shade';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  budget: 'Low' | 'Medium' | 'High';
  wateringFrequency: 'Daily' | 'Every 2-3 days' | 'Weekly' | 'Bi-weekly';
  gardenPurpose: 'Food Production' | 'Aesthetic/Beauty' | 'Wildlife Habitat' | 'Mixed Purpose';
  maintenanceLevel: 'Low Maintenance' | 'Moderate' | 'High Maintenance';
  previousCrops?: string;
  specificGoals?: string;
  growingMethod: 'In-ground' | 'Raised Beds' | 'Containers' | 'Hydroponic';
  climateZone?: string;
  // New fields
  expectedSowingTime?: string;
  soilPH?: 'Acidic (below 6.5)' | 'Neutral (6.5-7.5)' | 'Alkaline (above 7.5)' | 'Unknown';
  frostDates?: string;
  gardenSpace?: string;
  pestConcerns?: string;
  organicPreference: 'Yes' | 'No' | 'Preferred but not required';
  timeCommitment: 'Less than 1 hour/week' | '1-3 hours/week' | '3-5 hours/week' | 'More than 5 hours/week';
  harvestGoals?: string;
}

export interface CropRecommendation {
  name: string;
  planting_time: string;
  care_tips: string;
  watering_frequency: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  harvest_time: string;
  companion_plants?: string;
  spacing_requirements?: string;
  expected_yield?: string;
  pest_management?: string;
  soil_requirements?: string;
  growth_tips?: string;
}

export const getCropRecommendations = async (
  formData: CropRecommendationRequest
): Promise<CropRecommendation[]> => {
  try {
    const prompt = `
You are an expert AI crop advisor. Based on the comprehensive garden information below, provide 4-5 highly personalized crop recommendations suitable for spring planting.

Garden Details:
- Location: ${formData.location}
- Climate Zone: ${formData.climateZone || 'Not specified'}
- Garden Size: ${formData.gardenSize}
- Available Space: ${formData.gardenSpace || 'Not specified'}
- Growing Method: ${formData.growingMethod}
- Soil Type: ${formData.soilType}
- Soil pH: ${formData.soilPH || 'Unknown'}
- Sun Exposure: ${formData.sunExposure}
- Preferred Crop Type: ${formData.cropType}
- Gardener Experience: ${formData.experience}
- Budget: ${formData.budget}
- Time Commitment: ${formData.timeCommitment}
- Preferred Watering: ${formData.wateringFrequency}
- Garden Purpose: ${formData.gardenPurpose}
- Maintenance Preference: ${formData.maintenanceLevel}
- Organic Preference: ${formData.organicPreference}
- Previous Crops: ${formData.previousCrops || 'None specified'}
- Specific Goals: ${formData.specificGoals || 'General gardening'}
- Harvest Goals: ${formData.harvestGoals || 'Not specified'}
- Expected Sowing Time: ${formData.expectedSowingTime || 'Spring season'}
- Frost Dates: ${formData.frostDates || 'Not specified'}
- Pest Concerns: ${formData.pestConcerns || 'General concerns'}
- Season: Spring planting

For each recommendation, provide:
1. Crop name
2. Optimal planting time for the given location and conditions
3. Specific care tips tailored to soil type and conditions
4. Watering frequency that matches their preference
5. Difficulty level (Beginner/Intermediate/Advanced)
6. Expected harvest time
7. Compatible companion plants
8. Spacing requirements
9. Expected yield for garden size
10. Pest management strategies
11. Soil requirements and amendments
12. Growth tips specific to their setup

Please respond ONLY with valid JSON format as an array of objects with these exact keys:
- name
- planting_time
- care_tips
- watering_frequency
- difficulty_level
- harvest_time
- companion_plants
- spacing_requirements
- expected_yield
- pest_management
- soil_requirements
- growth_tips

Response format (JSON only, no additional text):
[
  {
    "name": "Lettuce",
    "planting_time": "Early spring (March-April)",
    "care_tips": "Perfect for ${formData.soilType} soil. Plant in well-draining soil with partial shade",
    "watering_frequency": "${formData.wateringFrequency}",
    "difficulty_level": "Beginner",
    "harvest_time": "45-65 days",
    "companion_plants": "Carrots, onions, herbs",
    "spacing_requirements": "6-8 inches apart",
    "expected_yield": "2-3 lbs per square foot",
    "pest_management": "Row covers for flea beetles, companion planting",
    "soil_requirements": "Well-draining, fertile soil with pH 6.0-7.0",
    "growth_tips": "Succession plant every 2 weeks for continuous harvest"
  }
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw API response:', text);
    
    // Clean the response text
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Extract JSON from the response
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', cleanedText);
      throw new Error('No valid JSON found in response');
    }
    
    const recommendations: CropRecommendation[] = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('Invalid response format');
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error getting crop recommendations:', error);
    
    // Fallback data without environmental impact
    return [
      {
        name: 'Lettuce',
        planting_time: 'Early Spring (March-April)',
        care_tips: `Ideal for ${formData.soilType} soil. Plant in well-draining soil, space plants 6-8 inches apart. Prefers cool weather and ${formData.sunExposure} conditions.`,
        watering_frequency: formData.wateringFrequency,
        difficulty_level: 'Beginner',
        harvest_time: '45-65 days',
        companion_plants: 'Carrots, onions, chives',
        spacing_requirements: '6-8 inches apart',
        expected_yield: '2-3 lbs per square foot',
        pest_management: 'Use row covers to protect from flea beetles and aphids',
        soil_requirements: 'Well-draining soil with pH 6.0-7.0, rich in organic matter',
        growth_tips: 'Plant in partial shade during warmer weather, succession plant every 2 weeks'
      },
      {
        name: 'Spinach',
        planting_time: 'Early Spring (March-April)',
        care_tips: `Thrives in ${formData.soilType} soil with good drainage. Perfect for ${formData.sunExposure} areas. Rich soil preferred.`,
        watering_frequency: formData.wateringFrequency,
        difficulty_level: 'Beginner',
        harvest_time: '40-50 days',
        companion_plants: 'Peas, beans, lettuce',
        spacing_requirements: '4-6 inches apart',
        expected_yield: '1-2 lbs per square foot',
        pest_management: 'Watch for leaf miners, use beneficial insects',
        soil_requirements: 'Rich, well-draining soil with pH 6.0-7.5',
        growth_tips: 'Harvest outer leaves first, plant in cool weather for best results'
      },
      {
        name: 'Peas',
        planting_time: 'Early Spring (February-April)',
        care_tips: `Excellent for ${formData.growingMethod} growing. Provide support for climbing varieties. Plant 2 inches deep in cool, moist soil.`,
        watering_frequency: formData.wateringFrequency,
        difficulty_level: 'Intermediate',
        harvest_time: '60-70 days',
        companion_plants: 'Carrots, radishes, spinach',
        spacing_requirements: '2-4 inches apart',
        expected_yield: '0.5-1 lb per square foot',
        pest_management: 'Use row covers early, watch for aphids and pea weevils',
        soil_requirements: 'Well-draining soil with pH 6.0-7.5, inoculate with rhizobia',
        growth_tips: 'Provide support structures early, harvest regularly for continued production'
      }
    ];
  }
};