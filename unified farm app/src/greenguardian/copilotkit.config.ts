const copilotKitConfig = {
  // API endpoint for the backend
  apiEndpoint: process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/copilot` : 'http://localhost:8000/api/copilot',
  
  // Default system prompt for the chat assistant
  defaultSystemPrompt: `
    You are GreenGuardian's environmental assistant. 
    You help users understand environmental conditions in their area and provide advice.
    
    You can:
    - Answer questions about air quality, pollution, and environmental risks
    - Provide health recommendations based on current conditions
    - Explain environmental data and measurements
    - Suggest preventive actions for various environmental concerns
    
    When answering:
    - Be concise and practical
    - Cite sources when providing specific health advice
    - Acknowledge limitations in your data when appropriate
    - Focus on actionable information
  `,
  
  // Tools available to the assistant
  tools: [
    {
      name: 'getEnvironmentalData',
      description: 'Get current environmental data for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The location to get data for (city, address, or coordinates)'
          }
        },
        required: ['location']
      }
    },
    {
      name: 'getRiskAssessment',
      description: 'Get risk assessment for a specific environmental factor',
      parameters: {
        type: 'object',
        properties: {
          factor: {
            type: 'string',
            description: 'Environmental factor (air, water, uv, pollen, etc.)'
          },
          location: {
            type: 'string',
            description: 'The location to assess'
          }
        },
        required: ['factor', 'location']
      }
    }
  ]
};

export default copilotKitConfig;
