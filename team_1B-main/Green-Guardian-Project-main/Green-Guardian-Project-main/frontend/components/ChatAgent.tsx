import React, { useState, useEffect } from 'react';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

interface ChatAgentProps {
  userProfile: string;
  location: string;
}

const ChatAgent: React.FC<ChatAgentProps> = ({ userProfile, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatContext, setChatContext] = useState<{
    userProfile: string;
    location: string;
  }>({ userProfile, location });

  // Update chat context when props change
  useEffect(() => {
    setChatContext({ userProfile, location });
  }, [userProfile, location]);

  // Get profile-specific placeholder text
  const getPlaceholderText = () => {
    switch (userProfile) {
      case 'farmer':
        return "Ask about crop recommendations, irrigation advice, or pest management...";
      case 'urban_planner':
        return "Ask about risk zones, green infrastructure, or pollution trends...";
      case 'ngo':
        return "Ask about environmental justice issues, community impact, or policy recommendations...";
      default:
        return "Ask about environmental conditions, health advice, or pollution concerns...";
    }
  };

  // Get profile-specific empty state message
  const getEmptyStateMessage = () => {
    switch (userProfile) {
      case 'farmer':
        return (
          <div className="text-center py-4 text-gray-500">
            <p>Ask me about crop recommendations, irrigation advice, pest management, or local environmental conditions.</p>
            <p className="mt-2 text-sm">Example: "What crops should I plant next month?" or "How should I adjust irrigation with the current weather?"</p>
          </div>
        );
      case 'urban_planner':
        return (
          <div className="text-center py-4 text-gray-500">
            <p>Ask me about environmental risk zones, green infrastructure opportunities, or pollution trends.</p>
            <p className="mt-2 text-sm">Example: "What areas are at highest risk for flooding?" or "How can we reduce the urban heat island effect?"</p>
          </div>
        );
      case 'ngo':
        return (
          <div className="text-center py-4 text-gray-500">
            <p>Ask me about environmental justice issues, community impact of pollution, or policy recommendations.</p>
            <p className="mt-2 text-sm">Example: "Which communities are most affected by air pollution?" or "What policy changes could improve water quality?"</p>
          </div>
        );
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            <p>Ask me about local environmental conditions, health advice, or pollution concerns.</p>
            <p className="mt-2 text-sm">Example: "Is it safe to exercise outdoors today?" or "What's causing the poor air quality?"</p>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Environmental Assistant</h3>
              {location && <p className="text-xs text-green-100">Location: {location}</p>}
            </div>
            {userProfile && (
              <span className="px-2 py-1 bg-green-700 text-xs rounded-full">
                {userProfile.charAt(0).toUpperCase() + userProfile.slice(1).replace('_', ' ')}
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <CopilotChat
              className="w-full h-full"
              placeholder={getPlaceholderText()}
              emptyStateComponent={getEmptyStateMessage()}
              // In a real implementation, you would pass the context to your backend
              // This is a simplified example
              contextItems={[
                {
                  name: "userContext",
                  text: JSON.stringify(chatContext)
                }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAgent;
