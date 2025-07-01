import React from 'react';
import SimpleChat from '../components/chat/SimpleChat';

const TestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Chat</h1>
      <div className="border p-4 rounded-lg">
        <SimpleChat />
      </div>
    </div>
  );
};

export default TestPage;
