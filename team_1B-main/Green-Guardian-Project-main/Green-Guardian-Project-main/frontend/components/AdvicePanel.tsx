import React, { useState, useEffect } from 'react';

interface AdviceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

interface AdvicePanelProps {
  userProfile: string;
  location: string;
}

const AdvicePanel: React.FC<AdvicePanelProps> = ({ userProfile, location }) => {
  const [adviceList, setAdviceList] = useState<AdviceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset when location or profile changes
    if (location) {
      setIsLoading(true);
      fetchAdvice(location, userProfile);
    }
  }, [location, userProfile]);

  const fetchAdvice = (locationStr: string, profile: string) => {
    // Mock data based on user profile - replace with actual API call
    let mockAdvice: AdviceItem[] = [];
    
    // Base advice items for all profiles
    const baseAdvice: AdviceItem[] = [
      {
        id: '1',
        category: 'Air Quality',
        title: 'Wear a mask outdoors',
        description: 'PM2.5 levels are elevated in your area. Consider wearing a mask when spending extended time outdoors.',
        severity: 'warning'
      },
      {
        id: '2',
        category: 'UV Exposure',
        title: 'Apply sunscreen',
        description: 'UV index is high today. Apply SPF 30+ sunscreen and wear protective clothing.',
        severity: 'critical'
      }
    ];
    
    // Profile-specific advice
    switch (profile) {
      case 'farmer':
        mockAdvice = [
          ...baseAdvice,
          {
            id: '3',
            category: 'Irrigation',
            title: 'Adjust watering schedule',
            description: 'Due to high temperatures, water early morning or late evening to reduce evaporation.',
            severity: 'warning'
          },
          {
            id: '4',
            category: 'Crop Protection',
            title: 'Monitor for pests',
            description: 'Current conditions favor aphid development. Check crops regularly and consider organic controls.',
            severity: 'info'
          }
        ];
        break;
        
      case 'urban_planner':
        mockAdvice = [
          ...baseAdvice,
          {
            id: '3',
            category: 'Heat Island',
            title: 'Cooling centers needed',
            description: 'Urban heat island effect is intensifying temperatures. Consider opening cooling centers in affected neighborhoods.',
            severity: 'critical'
          },
          {
            id: '4',
            category: 'Stormwater',
            title: 'Potential flooding',
            description: 'Heavy rainfall predicted. Ensure stormwater systems are clear of debris.',
            severity: 'warning'
          }
        ];
        break;
        
      case 'ngo':
        mockAdvice = [
          ...baseAdvice,
          {
            id: '3',
            category: 'Vulnerable Populations',
            title: 'Check on elderly residents',
            description: 'Heat wave affecting areas with high elderly population. Consider community outreach.',
            severity: 'critical'
          },
          {
            id: '4',
            category: 'Environmental Justice',
            title: 'Air quality disparity',
            description: 'Low-income neighborhoods showing significantly worse air quality. Document for advocacy purposes.',
            severity: 'warning'
          }
        ];
        break;
        
      default: // citizen
        mockAdvice = [
          ...baseAdvice,
          {
            id: '3',
            category: 'Pollen',
            title: 'Pollen levels increasing',
            description: 'Pollen counts are rising. Those with allergies should take preventive medication.',
            severity: 'info'
          },
          {
            id: '4',
            category: 'Heat Safety',
            title: 'Stay hydrated',
            description: 'Temperatures expected to reach 90°F. Drink plenty of water and limit outdoor activities.',
            severity: 'warning'
          }
        ];
    }

    // Simulate API fetch
    setTimeout(() => {
      setAdviceList(mockAdvice);
      setIsLoading(false);
    }, 1000);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'info':
      default:
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  if (isLoading) {
    return <div className="p-4 bg-white rounded-lg shadow-md">Loading advice...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Preventive Advice</h2>
        {location && <span className="text-sm text-gray-500">for {location}</span>}
      </div>
      
      {adviceList.length === 0 ? (
        <p className="text-gray-500">No specific advice for your area at this time.</p>
      ) : (
        <div className="space-y-3">
          {adviceList.map((advice) => (
            <div 
              key={advice.id} 
              className={`p-3 rounded-md ${getSeverityStyles(advice.severity)}`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{advice.category}</p>
                  <h3 className="font-medium">{advice.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{advice.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvicePanel;
