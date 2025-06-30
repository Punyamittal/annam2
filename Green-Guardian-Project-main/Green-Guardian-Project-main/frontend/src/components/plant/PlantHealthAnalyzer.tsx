import React, { useState, useRef, ChangeEvent } from 'react';

interface PlantHealthAnalysisResult {
  health: 'healthy' | 'moderate' | 'unhealthy';
  confidence: number;
  issues: string[];
  recommendations: string[];
}

const PlantHealthAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PlantHealthAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setAnalysisResult(null);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // In a real app, we would send the image to a backend API for analysis
    // For demo purposes, we'll simulate an API call with a timeout
    setTimeout(() => {
      // Mock analysis results
      const mockResults: PlantHealthAnalysisResult = generateMockAnalysis();
      
      setAnalysisResult(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockAnalysis = (): PlantHealthAnalysisResult => {
    // Generate random analysis for demo purposes
    const healthOptions: ('healthy' | 'moderate' | 'unhealthy')[] = ['healthy', 'moderate', 'unhealthy'];
    const randomHealth = healthOptions[Math.floor(Math.random() * healthOptions.length)];
    
    const confidence = Math.round((0.7 + Math.random() * 0.25) * 100) / 100;
    
    let issues: string[] = [];
    let recommendations: string[] = [];
    
    if (randomHealth === 'healthy') {
      issues = [];
      recommendations = [
        'Continue with current care routine',
        'Maintain regular watering schedule',
        'Monitor for any changes in leaf color or growth'
      ];
    } else if (randomHealth === 'moderate') {
      issues = [
        'Minor signs of nutrient deficiency',
        'Early signs of leaf discoloration',
        'Slight wilting in some areas'
      ];
      recommendations = [
        'Consider adding balanced fertilizer',
        'Adjust watering frequency based on soil moisture',
        'Ensure adequate sunlight exposure',
        'Monitor for pest activity'
      ];
    } else {
      issues = [
        'Significant leaf discoloration',
        'Signs of pest infestation',
        'Fungal growth detected',
        'Severe wilting'
      ];
      recommendations = [
        'Treat with appropriate fungicide or pesticide',
        'Adjust watering immediately - likely overwatering',
        'Improve drainage in soil',
        'Consider repotting with fresh soil',
        'Prune affected areas'
      ];
    }
    
    return {
      health: randomHealth,
      confidence,
      issues,
      recommendations
    };
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-4">
        <h2 className="text-xl font-medium">Plant Health Analyzer</h2>
        <p className="text-sm opacity-90">Upload a photo of your plant to assess its health</p>
      </div>
      
      <div className="p-4">
        {!selectedImage ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 mb-4">Drag and drop an image here or click to browse</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
              Upload Image
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 relative">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="w-full h-64 object-contain rounded-lg"
              />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {!analysisResult && !isAnalyzing && (
              <button
                onClick={handleAnalyzeClick}
                className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Analyze Plant Health
              </button>
            )}
            
            {isAnalyzing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto mb-2"></div>
                <p className="text-gray-600">Analyzing plant health...</p>
              </div>
            )}
            
            {analysisResult && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <div className={`p-4 ${
                  analysisResult.health === 'healthy' ? 'bg-green-50' :
                  analysisResult.health === 'moderate' ? 'bg-yellow-50' :
                  'bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${getHealthColor(analysisResult.health)}`}>
                      {analysisResult.health === 'healthy' ? 'Healthy Plant' :
                       analysisResult.health === 'moderate' ? 'Moderately Healthy Plant' :
                       'Unhealthy Plant'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {Math.round(analysisResult.confidence * 100)}% confidence
                    </span>
                  </div>
                  
                  {analysisResult.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Detected Issues:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysisResult.issues.map((issue, index) => (
                          <li key={index} className="text-sm">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Recommendations:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm">{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;
