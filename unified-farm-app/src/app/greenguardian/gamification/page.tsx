"use client";

import React, { useState } from 'react';
import Challenges from '../../../greenguardian/components/gamification/Challenges';
import Leaderboard from '../../../greenguardian/components/gamification/Leaderboard';

const GreenGuardianGamificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Environmental Action Platform</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="text-sm text-gray-500">Your Points</div>
              <div className="text-3xl font-bold text-yellow-500">820</div>
            </div>
            <div className="flex-grow">
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>Next Level: 1000</span>
              </div>
            </div>
            <div className="ml-4 text-center">
              <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                4
              </div>
              <div className="text-xs text-gray-500 mt-1">Level</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-xs text-gray-500">Challenges Completed</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-xs text-gray-500">Badges Earned</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-purple-600">#4</div>
              <div className="text-xs text-gray-500">Leaderboard Rank</div>
            </div>
          </div>
        </div>
        
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'challenges' 
                  ? 'border-b-2 border-green-500 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('challenges')}
            >
              Challenges
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'leaderboard' 
                  ? 'border-b-2 border-green-500 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('leaderboard')}
            >
              Leaderboard
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'challenges' ? (
        <Challenges />
      ) : (
        <Leaderboard />
      )}
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Your Environmental Impact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-medium">Carbon Reduction</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">127 kg</div>
            <p className="text-sm text-gray-600 mt-1">CO₂ emissions prevented</p>
            <div className="mt-3 h-1.5 bg-gray-200 rounded-full">
              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">65% of your monthly goal</div>
          </div>
          
          <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="font-medium">Water Saved</h3>
            </div>
            <div className="text-3xl font-bold text-cyan-600">342 L</div>
            <p className="text-sm text-gray-600 mt-1">Water conservation</p>
            <div className="mt-3 h-1.5 bg-gray-200 rounded-full">
              <div className="h-1.5 bg-cyan-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">78% of your monthly goal</div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h3 className="font-medium">Waste Reduced</h3>
            </div>
            <div className="text-3xl font-bold text-amber-600">8.5 kg</div>
            <p className="text-sm text-gray-600 mt-1">Waste diverted from landfill</p>
            <div className="mt-3 h-1.5 bg-gray-200 rounded-full">
              <div className="h-1.5 bg-amber-500 rounded-full" style={{ width: '42%' }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">42% of your monthly goal</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Share your environmental impact with friends</p>
          <div className="flex justify-center space-x-4">
            <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </button>
            <button className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenGuardianGamificationPage;