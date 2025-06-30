import React, { useState, useEffect } from 'react';

const SimpleChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hello! How can I help you with environmental information today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setApiError(null);

    try {
      console.log("Sending chat request to backend...");
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
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response from backend:", data);
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || "I'm sorry, I couldn't process your request."
      }]);
    } catch (error) {
      console.error('Error:', error);
      setApiError(`Error: ${error instanceof Error ? error.message : String(error)}`);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, there was an error processing your request. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="chat-container bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-3">
        <h3 className="font-medium">Environmental Assistant</h3>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
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
        
        {apiError && (
          <div className="text-center p-2 text-red-500 text-sm">
            {apiError}
          </div>
        )}
      </div>
      
      <div className="border-t p-3 flex">
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about environmental conditions..."
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
  );
};

export default SimpleChat;
