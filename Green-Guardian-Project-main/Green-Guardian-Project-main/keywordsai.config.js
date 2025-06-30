module.exports = {
  apiKey: process.env.KEYWORDS_AI_API_KEY,
  projectId: 'greenguardian',
  environment: process.env.NODE_ENV || 'development',
  traces: {
    enabled: true,
    sampleRate: 1.0,
  },
  monitoring: {
    enabled: true,
    endpoints: [
      '/api/chat',
      '/api/environmental-data',
      '/api/risk-assessment'
    ]
  },
  llmTracing: {
    enabled: true,
    providers: ['openai']
  }
};
