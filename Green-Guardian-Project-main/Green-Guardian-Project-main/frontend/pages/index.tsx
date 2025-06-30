import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import RiskSummary from '../components/RiskSummary';
import AdvicePanel from '../components/AdvicePanel';
import ChatAgent from '../src/components/ChatAgent';
import UserProfileSelector from '../components/UserProfileSelector';

export default function Home() {
  const [userProfile, setUserProfile] = useState('citizen');
  const [location, setLocation] = useState('');

  const handleProfileChange = (profile: string) => {
    setUserProfile(profile);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    // You could store this in localStorage or pass to other components
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-700">GreenGuardian</h1>
        <p className="text-gray-600">AI-powered environmental monitoring for your local area</p>
      </header>

      <UserProfileSelector onProfileChange={handleProfileChange} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView onLocationSelect={handleLocationChange} />
        </div>
        <div>
          <RiskSummary userProfile={userProfile} location={location} />
          <div className="mt-6">
            <AdvicePanel userProfile={userProfile} location={location} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ChatAgent userProfile={userProfile} location={location} />
      </div>
    </div>
  );
}
