import React, { useState, useEffect } from 'react';
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
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hello! How can I help you with environmental information today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Get profile-specific responses
  const getProfileSpecificResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    switch (userProfile) {
      case 'farmer':
        if (lowerQuery.includes('crop') || lowerQuery.includes('plant')) {
          return "Based on your location and the current season, I recommend planting tomatoes, peppers, and cucumbers. These crops thrive in your climate zone and have good market value.";
        } else if (lowerQuery.includes('irrigation') || lowerQuery.includes('water')) {
          return "For optimal irrigation in your area, I recommend drip irrigation systems which can reduce water usage by up to 60% compared to traditional methods. Given the recent rainfall patterns, you should water deeply twice a week rather than daily shallow watering.";
        } else if (lowerQuery.includes('pest') || lowerQuery.includes('insect')) {
          return "I've detected reports of aphid infestations in your region. Consider introducing ladybugs as a natural predator or using neem oil as an organic pesticide. Preventative measures include crop rotation and maintaining biodiversity around your fields.";
        }
        break;
      
      case 'urban_planner':
        if (lowerQuery.includes('risk') || lowerQuery.includes('zone')) {
          return "The highest environmental risk zones in your area are along the eastern floodplain, which has a 15% increased risk of flooding compared to last year. I recommend focusing green infrastructure development in these areas to mitigate flood damage.";
        } else if (lowerQuery.includes('infrastructure') || lowerQuery.includes('green')) {
          return "For your urban area, I recommend implementing rain gardens and bioswales along major roadways to manage stormwater runoff. Green roofs would be particularly effective in the downtown district where impervious surfaces exceed 85%.";
        } else if (lowerQuery.includes('pollution') || lowerQuery.includes('trend')) {
          return "Pollution trends in your area show a 12% decrease in particulate matter over the past year, but a 7% increase in nitrogen dioxide levels, likely due to increased traffic. The most affected neighborhoods are those along the highway corridor.";
        }
        break;
      
      case 'ngo':
        if (lowerQuery.includes('justice') || lowerQuery.includes('equity')) {
          return "Environmental justice analysis shows that lower-income neighborhoods in your area face 3x higher pollution exposure than affluent areas. The most pressing issue is industrial emissions affecting the southwest district, where respiratory illness rates are 22% above the city average.";
        } else if (lowerQuery.includes('community') || lowerQuery.includes('impact')) {
          return "Community impact assessments indicate that the recent water quality improvements have reduced waterborne illness by 34% in riverside communities. However, air quality remains a concern with disproportionate impacts on minority populations.";
        } else if (lowerQuery.includes('policy') || lowerQuery.includes('recommendation')) {
          return "Based on current data, I recommend focusing policy efforts on: 1) Stricter emissions standards for the industrial zone, 2) Expanding public transportation to reduce car dependency, and 3) Implementing community-led air quality monitoring programs in affected neighborhoods.";
        }
        break;
    }
    
    // Default responses for any profile
    if (lowerQuery.includes('hi') || lowerQuery.includes('hello')) {
      return "Hello! I'm your environmental assistant specialized for your role as a " + userProfile.replace('_', ' ') + ". How can I help you today?";
    } else if (lowerQuery.includes('weather')) {
      return "The weather in " + location + " today is sunny with a high of 75°F (24°C) and a low of 60°F (15°C). There's a 10% chance of precipitation.";
    } else if (lowerQuery.includes('pollution') || lowerQuery.includes('air quality')) {
      return "The air quality in " + location + " is currently good with an Air Quality Index (AQI) of 42, which is considered satisfactory. The main pollutant is PM2.5 at 10.5 µg/m³.";
    }
    
    return "I'm here to help with environmental information specific to your role as a " + userProfile.replace('_', ' ') + ". You can ask me about environmental conditions, specific concerns for your field, or get location-based advice for " + location + ".";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Make API call to backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          location: location,
          user_type: userProfile
        }),
      });

      const data = await response.json();
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || "I'm sorry, I couldn't process your request."
      }]);
    } catch (error) {
      console.error('Error:', error);
      
      // Use profile-specific responses when the server is not available
      const profileResponse = getProfileSpecificResponse(inputValue);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: profileResponse
      }]);
    } finally {
      setIsLoading(false);
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
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-green-100 text-green-900' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-green-700 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex w-full">
              <input
                className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getPlaceholderText()}
                disabled={isLoading}
              />
              <button 
                type="submit"
                className={`px-4 rounded-r-lg transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-green-700 text-white hover:bg-green-800'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAgent;
