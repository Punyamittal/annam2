export interface SavedCrop {
  id: string;
  name: string;
  planting_time: string;
  care_tips: string;
  watering_frequency: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  harvest_time: string;
  saved_date: string;
  location?: string;
  garden_size?: string;
  crop_type?: string;
}

const STORAGE_KEY = 'ai_crop_advisor_saved_crops';

export const journalService = {
  // Get all saved crops from localStorage
  getSavedCrops(): SavedCrop[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved crops:', error);
      return [];
    }
  },

  // Save a crop to localStorage
  saveCrop(crop: Omit<SavedCrop, 'id' | 'saved_date'>, userLocation?: string, gardenSize?: string, cropType?: string): SavedCrop {
    try {
      const savedCrops = this.getSavedCrops();
      const newCrop: SavedCrop = {
        ...crop,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        saved_date: new Date().toISOString(),
        location: userLocation,
        garden_size: gardenSize,
        crop_type: cropType,
      };

      // Check if crop with same name already exists
      const existingIndex = savedCrops.findIndex(saved => saved.name.toLowerCase() === crop.name.toLowerCase());
      
      if (existingIndex !== -1) {
        // Update existing crop
        savedCrops[existingIndex] = newCrop;
      } else {
        // Add new crop
        savedCrops.push(newCrop);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCrops));
      return newCrop;
    } catch (error) {
      console.error('Error saving crop:', error);
      throw new Error('Failed to save crop');
    }
  },

  // Remove a crop from localStorage
  removeCrop(cropId: string): void {
    try {
      const savedCrops = this.getSavedCrops();
      const filteredCrops = savedCrops.filter(crop => crop.id !== cropId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCrops));
    } catch (error) {
      console.error('Error removing crop:', error);
      throw new Error('Failed to remove crop');
    }
  },

  // Check if a crop is already saved
  isCropSaved(cropName: string): boolean {
    const savedCrops = this.getSavedCrops();
    return savedCrops.some(saved => saved.name.toLowerCase() === cropName.toLowerCase());
  }
};