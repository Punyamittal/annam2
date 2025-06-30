import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
import RiskSummary from '../components/RiskSummary';
import AdvicePanel from '../components/AdvicePanel';
import ChatButton from '../components/ChatButton';
import UserProfileSelector from '../components/UserProfileSelector';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const [userProfile, setUserProfile] = useState('citizen');
  const [location, setLocation] = useState('');
  const { user, isAuthenticated } = useAuth();

  const handleProfileChange = (profile: string) => {
    setUserProfile(profile);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  return (
    <Layout title="GreenGuardian - Environmental Monitoring">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-700">GreenGuardian</h1>
        <p className="text-gray-600">AI-powered environmental monitoring for your local area</p>
        {user ? (
          <p className="mt-2 text-sm text-green-600">
            Welcome back, {user.name}!
          </p>
        ) : (
          <div className="mt-4">
            <Link 
              href="/login" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Log In
            </Link>
            <Link 
              href="/register" 
              className="inline-block bg-white border border-green-600 hover:bg-green-50 text-green-600 font-bold py-2 px-4 rounded"
            >
              Sign Up
            </Link>
          </div>
        )}
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

      {/* Only the chat button, no other chat components */}
      <ChatButton userProfile={userProfile} location={location} />
    </Layout>
  );
}
