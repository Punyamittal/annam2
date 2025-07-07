import React, { useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'carbon' | 'water' | 'waste' | 'energy' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  completionRate: number;
  isActive: boolean;
  isCompleted: boolean;
  startDate?: string;
  endDate?: string;
}

const Challenges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Reduce Carbon Footprint by 10%',
      description: 'Track and reduce your carbon emissions by 10% this week through transportation, energy, and consumption choices.',
      points: 100,
      category: 'carbon',
      difficulty: 'medium',
      duration: '1 week',
      completionRate: 68,
      isActive: false,
      isCompleted: false
    },
    {
      id: '2',
      title: 'Zero Waste Day',
      description: 'Go an entire day without producing any landfill waste. Use reusable containers and avoid single-use plastics.',
      points: 50,
      category: 'waste',
      difficulty: 'easy',
      duration: '1 day',
      completionRate: 82,
      isActive: false,
      isCompleted: false
    },
    {
      id: '3',
      title: 'Plant 5 Native Trees',
      description: 'Plant five native trees in your community to improve air quality and provide habitat for local wildlife.',
      points: 200,
      category: 'community',
      difficulty: 'hard',
      duration: '1 month',
      completionRate: 45,
      isActive: false,
      isCompleted: false
    },
    {
      id: '4',
      title: 'Water Conservation Week',
      description: 'Reduce your water usage by 20% for a week by taking shorter showers, fixing leaks, and being mindful of usage.',
      points: 75,
      category: 'water',
      difficulty: 'medium',
      duration: '1 week',
      completionRate: 71,
      isActive: true,
      isCompleted: false,
      startDate: '2025-06-10',
      endDate: '2025-06-17'
    },
    {
      id: '5',
      title: 'Meatless Monday',
      description: 'Go vegetarian for a day to reduce your carbon footprint associated with meat production.',
      points: 30,
      category: 'carbon',
      difficulty: 'easy',
      duration: '1 day',
      completionRate: 89,
      isActive: false,
      isCompleted: true
    },
    {
      id: '6',
      title: 'Energy Audit',
      description: 'Conduct an energy audit of your home and implement at least 3 energy-saving improvements.',
      points: 150,
      category: 'energy',
      difficulty: 'hard',
      duration: '2 weeks',
      completionRate: 52,
      isActive: false,
      isCompleted: true
    }
  ]);

  const handleAcceptChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge => 
      challenge.id === challengeId 
        ? { 
            ...challenge, 
            isActive: true, 
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + getDurationInMs(challenge.duration)).toISOString().split('T')[0]
          } 
        : challenge
    ));
    setActiveTab('active');
  };

  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isActive: false, isCompleted: true } 
        : challenge
    ));
    // In a real app, you would update the user's points here
  };

  const getDurationInMs = (duration: string): number => {
    const [amount, unit] = duration.split(' ');
    const amountNum = parseInt(amount);
    
    switch (unit) {
      case 'day':
      case 'days':
        return amountNum * 24 * 60 * 60 * 1000;
      case 'week':
      case 'weeks':
        return amountNum * 7 * 24 * 60 * 60 * 1000;
      case 'month':
      case 'months':
        return amountNum * 30 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'carbon':
        return 'bg-blue-100 text-blue-800';
      case 'water':
        return 'bg-cyan-100 text-cyan-800';
      case 'waste':
        return 'bg-amber-100 text-amber-800';
      case 'energy':
        return 'bg-purple-100 text-purple-800';
      case 'community':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'available') return !challenge.isActive && !challenge.isCompleted;
    if (activeTab === 'active') return challenge.isActive;
    return challenge.isCompleted;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-4">
        <h2 className="text-xl font-medium">Environmental Challenges</h2>
        <p className="text-sm opacity-90">Complete challenges to earn points and make a difference</p>
      </div>
      
      <div className="border-b">
        <nav className="flex">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'available' 
                ? 'border-b-2 border-green-500 text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Available
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'active' 
                ? 'border-b-2 border-green-500 text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'completed' 
                ? 'border-b-2 border-green-500 text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </nav>
      </div>
      
      <div className="p-4">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No challenges in this category yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChallenges.map(challenge => (
              <div key={challenge.id} className="border rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{challenge.title}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                      <span className="font-bold">{challenge.points}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}>
                      {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {challenge.duration}
                    </span>
                  </div>
                  
                  {activeTab === 'available' && (
                    <div className="mt-4">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span>Completion rate: {challenge.completionRate}%</span>
                        <span className="flex-grow"></span>
                        <span>{challenge.completionRate > 75 ? 'Popular!' : challenge.completionRate < 50 ? 'Challenging' : ''}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full">
                        <div 
                          className="h-1.5 bg-green-500 rounded-full" 
                          style={{ width: `${challenge.completionRate}%` }}
                        ></div>
                      </div>
                      <button
                        className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => handleAcceptChallenge(challenge.id)}
                      >
                        Accept Challenge
                      </button>
                    </div>
                  )}
                  
                  {activeTab === 'active' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Started: {challenge.startDate}</span>
                        <span>Ends: {challenge.endDate}</span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button
                          className="flex-grow py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          onClick={() => handleCompleteChallenge(challenge.id)}
                        >
                          Mark as Complete
                        </button>
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setChallenges(challenges.map(c => 
                              c.id === challenge.id ? { ...c, isActive: false } : c
                            ));
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'completed' && (
                    <div className="mt-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-600 font-medium">Completed</span>
                      <div className="flex-grow"></div>
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // In a real app, this would share to social media
                          alert('Sharing to social media: "I completed the ' + challenge.title + ' challenge on GreenGuardian!"');
                        }}
                      >
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
