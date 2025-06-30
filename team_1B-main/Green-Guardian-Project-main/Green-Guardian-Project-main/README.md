# GreenGuardian – AI for Environmental Monitoring

An AI-powered platform for monitoring and analyzing environmental conditions.

## Overview
GreenGuardian provides real-time environmental monitoring, risk assessment, and personalized advice to help users understand and respond to environmental conditions in their area.

## Features
- Interactive map visualization of pollution and risk zones
- Environmental risk summaries
- Preventive advice based on local conditions
- AI-powered chat assistant for environmental queries
- Historical environmental data analysis

## Tech Stack

- **Frontend**: React.js + TypeScript  
- **Styling**: Tailwind CSS  
- **Mapping**: Leaflet.js  
- **Authentication & Backend**: Appwrite  
- **Environmental Data APIs**:  
  - OpenWeatherMap (temperature, humidity, rainfall)  
  - AirQuality API (AQI, PM2.5, PM10)  
  - Satellite Imagery API (NDVI, vegetation changes)  
- **CopilotKit** – Embedded in-app copilots that help users interact with environmental data more intuitively, suggest analysis, and offer AI-guided exploration of trends.  
- **Tavily** – Used for AI-enhanced environmental context and information retrieval, such as explaining climate risks or defining environmental terms dynamically.  
- **Mem0** – Integrated for lightweight vector memory, enabling contextual responses based on a user’s past queries or preferences.
- **Keywords AI** – Powers natural language command parsing for user interactions,Monitoring and tracing for AI operations .



## Key Components
- **MapView**: Interactive map visualization of pollution and risk zones
- **RiskSummary**: Environmental risk assessment display
- **AdvicePanel**: Preventive advice based on local conditions
- **ChatAgent**: AI-powered chat assistant for environmental queries
- **Agent Layer**: AI agents for specialized tasks
    - **PollutionAgent**: Processes pollution data from various sources
    - **AdviceAgent**: Generates recommendations based on environmental data
    - **MemoryAgent**: Manages conversation history and context

## Services
- **TavilyService**: Integration with Tavily for environmental data retrieval
- **Mem0Service**: Memory storage for conversation context
- **AppwriteService**: User management and database operations
- **WeatherAPI**: Integration with weather data providers
- **KeywordsAI**: Monitoring and tracing for AI operations
- **Appwrite**: Primary database for user data, regions, and environmental records
- **Mem0**: Memory storage for conversation context and historical queries

## Data Flow

1. User interacts with the frontend interface
2. Frontend makes API calls to the backend
3. Backend retrieves data from external sources via services
4. AI agents process and analyze the data
5. Results are stored in the database and returned to the frontend
6. Frontend displays the processed data to the user


## Getting Started

### Frontend Setup
1. Install dependencies:
   ```
   npm install
   ```

2. Make sure the `.env` file has your API keys:
   ```
   TAVILY_API_KEY=

   # Appwrite Configuration
   APPWRITE_ENDPOINT=
   APPWRITE_PROJECT_ID=
   APPWRITE_API_KEY=
   
   
   # Mem0 Configuration
   MEM0_API_KEY=

   # Weather API Configuration
   WEATHER_API_KEY=
   
   # Keywords AI Configuration
   KEYWORDS_AI_API_KEY=
   
   # Environment
   NODE_ENV=development

   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```
