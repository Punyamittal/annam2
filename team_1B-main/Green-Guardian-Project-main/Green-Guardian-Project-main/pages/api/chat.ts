import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, requestBodyProps } = req.body;
    
    // Extract location and user_type from requestBodyProps
    const location = requestBodyProps?.location || '';
    const user_type = requestBodyProps?.user_type || 'citizen';
    
    // Prepare the request to send to our backend
    const backendRequest = {
      messages: messages,
      location: location,
      user_type: user_type
    };
    
    // Call our backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendRequest),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get response from backend');
    }
    
    const data = await response.json();
    
    // Return the response in the format expected by CopilotKit
    return res.status(200).json({
      messages: [
        {
          role: 'assistant',
          content: data.response
        }
      ]
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request',
      messages: [
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error while processing your request. Please try again later.'
        }
      ]
    });
  }
}
