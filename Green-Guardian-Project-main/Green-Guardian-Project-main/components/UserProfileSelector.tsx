import React, { useState, useEffect } from 'react';

interface UserProfileSelectorProps {
  onProfileChange: (profile: string) => void;
  initialProfile?: string;
}

const UserProfileSelector: React.FC<UserProfileSelectorProps> = ({ onProfileChange, initialProfile = 'citizen' }) => {
  const [selectedProfile, setSelectedProfile] = useState<string>(initialProfile);

  useEffect(() => {
    // Load saved profile from localStorage if available
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setSelectedProfile(savedProfile);
      onProfileChange(savedProfile);
    }
  }, [onProfileChange]);

  const handleProfileChange = (profile: string) => {
    setSelectedProfile(profile);
    localStorage.setItem('userProfile', profile);
    onProfileChange(profile);
  };

  const profiles = [
    {
      id: 'citizen',
      name: 'Citizen',
      description: 'Personal health recommendations and daily activity advice',
      icon: '👤'
    },
    {
      id: 'farmer',
      name: 'Farmer',
      description: 'Agricultural insights, crop recommendations, and irrigation advice',
      icon: '🌾'
    },
    {
      id: 'urban_planner',
      name: 'Urban Planner',
      description: 'Risk zone analysis, green infrastructure, and pollution trends',
      icon: '🏙️'
    },
    {
      id: 'ngo',
      name: 'NGO',
      description: 'Environmental justice, community impact, and policy recommendations',
      icon: '🌍'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">I am a...</h2>
      <div className="grid grid-cols-2 gap-3">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleProfileChange(profile.id)}
            className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
              selectedProfile === profile.id
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mb-1">{profile.icon}</span>
            <span className="font-medium">{profile.name}</span>
            <span className="text-xs text-gray-500 text-center mt-1">{profile.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserProfileSelector;
