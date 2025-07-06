import React, { useState } from 'react';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar: string;
  badges: string[];
  completedChallenges: number;
  isCurrentUser: boolean;
}

const Leaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [category, setCategory] = useState<'all' | 'carbon' | 'water' | 'waste' | 'energy' | 'community'>('all');
  
  // Mock leaderboard data
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([
    {
      id: '1',
      name: 'Aanya Sharma',
      points: 1250,
      rank: 1,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      badges: ['Carbon Champion', 'Tree Planter'],
      completedChallenges: 12,
      isCurrentUser: false
    },
    {
      id: '2',
      name: 'Raj Patel',
      points: 980,
      rank: 2,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      badges: ['Water Warrior', 'Community Leader'],
      completedChallenges: 9,
      isCurrentUser: false
    },
    {
      id: '3',
      name: 'Priya Singh',
      points: 875,
      rank: 3,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      badges: ['Waste Reducer'],
      completedChallenges: 8,
      isCurrentUser: false
    },
    {
      id: '4',
      name: 'Vikram Mehta',
      points: 820,
      rank: 4,
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      badges: ['Energy Saver'],
      completedChallenges: 7,
      isCurrentUser: true
    },
    {
      id: '5',
      name: 'Neha Gupta',
      points: 780,
      rank: 5,
      avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
      badges: ['Eco Warrior'],
      completedChallenges: 6,
      isCurrentUser: false
    },
    {
      id: '6',
      name: 'Arjun Kumar',
      points: 720,
      rank: 6,
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
      badges: ['Waste Reducer'],
      completedChallenges: 5,
      isCurrentUser: false
    },
    {
      id: '7',
      name: 'Divya Reddy',
      points: 650,
      rank: 7,
      avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
      badges: ['Water Warrior'],
      completedChallenges: 4,
      isCurrentUser: false
    },
    {
      id: '8',
      name: 'Sanjay Verma',
      points: 590,
      rank: 8,
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      badges: ['Energy Saver'],
      completedChallenges: 4,
      isCurrentUser: false
    },
    {
      id: '9',
      name: 'Meera Joshi',
      points: 540,
      rank: 9,
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      badges: ['Community Leader'],
      completedChallenges: 3,
      isCurrentUser: false
    },
    {
      id: '10',
      name: 'Rahul Sharma',
      points: 510,
      rank: 10,
      avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
      badges: ['Tree Planter'],
      completedChallenges: 3,
      isCurrentUser: false
    }
  ]);

  const getBadgeColor = (badge: string) => {
    if (badge.includes('Carbon')) return 'bg-blue-100 text-blue-800';
    if (badge.includes('Water')) return 'bg-cyan-100 text-cyan-800';
    if (badge.includes('Waste')) return 'bg-amber-100 text-amber-800';
    if (badge.includes('Energy')) return 'bg-purple-100 text-purple-800';
    if (badge.includes('Community') || badge.includes('Tree')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const currentUser = leaderboardData.find(user => user.isCurrentUser);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-4">
        <h2 className="text-xl font-medium">Environmental Leaderboard</h2>
        <p className="text-sm opacity-90">See how you rank against other environmentally conscious users</p>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="space-x-2">
            <span className="text-sm text-gray-600">Timeframe:</span>
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'weekly' | 'monthly' | 'allTime')}
              className="text-sm border rounded p-1"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
          
          <div className="space-x-2">
            <span className="text-sm text-gray-600">Category:</span>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as 'all' | 'carbon' | 'water' | 'waste' | 'energy' | 'community')}
              className="text-sm border rounded p-1"
            >
              <option value="all">All Categories</option>
              <option value="carbon">Carbon Reduction</option>
              <option value="water">Water Conservation</option>
              <option value="waste">Waste Reduction</option>
              <option value="energy">Energy Saving</option>
              <option value="community">Community Action</option>
            </select>
          </div>
        </div>
        
        {/* Top 3 Users */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* 2nd Place */}
          {leaderboardData.length > 1 && (
            <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
              <div className="relative inline-block">
                <img 
                  src={leaderboardData[1].avatar} 
                  alt={leaderboardData[1].name} 
                  className="w-16 h-16 rounded-full mx-auto border-2 border-gray-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-gray-300 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="mt-2 font-medium">{leaderboardData[1].name}</h3>
              <div className="text-yellow-500 font-bold">{leaderboardData[1].points} pts</div>
              <div className="text-xs text-gray-500">{leaderboardData[1].completedChallenges} challenges</div>
            </div>
          )}
          
          {/* 1st Place */}
          {leaderboardData.length > 0 && (
            <div className="flex-1 bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200 md:-mt-4">
              <div className="relative inline-block">
                <img 
                  src={leaderboardData[0].avatar} 
                  alt={leaderboardData[0].name} 
                  className="w-20 h-20 rounded-full mx-auto border-2 border-yellow-400"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="mt-2 font-medium">{leaderboardData[0].name}</h3>
              <div className="text-yellow-500 font-bold text-lg">{leaderboardData[0].points} pts</div>
              <div className="text-xs text-gray-500">{leaderboardData[0].completedChallenges} challenges</div>
              
              {leaderboardData[0].badges.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {leaderboardData[0].badges.slice(0, 2).map((badge, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-0.5 rounded-full text-xs ${getBadgeColor(badge)}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* 3rd Place */}
          {leaderboardData.length > 2 && (
            <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
              <div className="relative inline-block">
                <img 
                  src={leaderboardData[2].avatar} 
                  alt={leaderboardData[2].name} 
                  className="w-16 h-16 rounded-full mx-auto border-2 border-orange-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-orange-300 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="mt-2 font-medium">{leaderboardData[2].name}</h3>
              <div className="text-yellow-500 font-bold">{leaderboardData[2].points} pts</div>
              <div className="text-xs text-gray-500">{leaderboardData[2].completedChallenges} challenges</div>
            </div>
          )}
        </div>
        
        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badges
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((user) => (
                <tr 
                  key={user.id} 
                  className={user.isCurrentUser ? 'bg-green-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{user.rank}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name} {user.isCurrentUser && <span className="text-xs text-green-600">(You)</span>}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.completedChallenges} challenges completed
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-bold">{user.points}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge, index) => (
                        <span 
                          key={index} 
                          className={`px-2 py-0.5 rounded-full text-xs ${getBadgeColor(badge)}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Current User Stats */}
        {currentUser && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-medium mb-2">Your Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Current Rank</div>
                <div className="text-2xl font-bold">#{currentUser.rank}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Points</div>
                <div className="text-2xl font-bold text-yellow-500">{currentUser.points}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Challenges Completed</div>
                <div className="text-2xl font-bold text-green-600">{currentUser.completedChallenges}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              You need <span className="font-bold">{leaderboardData[currentUser.rank - 2]?.points - currentUser.points}</span> more points to reach rank #{currentUser.rank - 1}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
