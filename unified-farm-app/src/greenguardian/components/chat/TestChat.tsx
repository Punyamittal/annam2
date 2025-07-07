import React, { useState } from 'react';

const TestChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hello! How can I help you with environmental information today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('http://localhost:8000/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content || "I'm sorry, I couldn't process your request."
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, there was an error processing your request. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-4 p-4 border rounded">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
        
        {isLoading && <div className="text-gray-500">Loading...</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <input
          className="flex-grow p-2 border rounded-l"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded-r"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default TestChat;
