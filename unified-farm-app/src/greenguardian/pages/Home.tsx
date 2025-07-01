import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Monitor Your Environment with AI-Powered Insights
                </h1>
                <p className="text-green-100 text-lg mb-8 max-w-lg">
                  GreenGuardian provides real-time environmental monitoring, risk assessment, and personalized advice to help you understand and respond to environmental conditions in your area.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/map" className="px-6 py-3 bg-white text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors shadow-md">
                    Explore Map
                  </Link>
                  <Link to="/farming" className="px-6 py-3 bg-green-900 text-white font-medium rounded-lg hover:bg-green-800 transition-colors shadow-md border border-green-700">
                    Farming Tools
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="bg-white p-4 rounded-lg shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Environmental landscape" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-green-700 text-white p-4 rounded-lg shadow-lg">
                      <p className="font-bold">Real-time monitoring</p>
                      <p className="text-sm">Powered by AI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
            <p className="text-gray-600">
              Visualize pollution zones, risk areas, and environmental conditions with our interactive heat maps and zone overlays.
            </p>
            <Link to="/map" className="mt-4 inline-block text-green-700 font-medium hover:underline">
              Explore Maps →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Historical Analysis</h3>
            <p className="text-gray-600">
              Track environmental trends over time with comprehensive historical data analysis and visualizations.
            </p>
            <Link to="/historical" className="mt-4 inline-block text-green-700 font-medium hover:underline">
              View Trends →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Farming Tools</h3>
            <p className="text-gray-600">
              Get crop recommendations, planting calendars, and analyze plant health with our AI-powered farming tools.
            </p>
            <Link to="/farming" className="mt-4 inline-block text-green-700 font-medium hover:underline">
              Access Tools →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-12 rounded-xl">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Select Location</h3>
              <p className="text-gray-600 text-sm">Choose your location from the map or search for a specific area.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Get Real-time Data</h3>
              <p className="text-gray-600 text-sm">Our AI crawls the web for the latest environmental data for your area.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">View Analysis</h3>
              <p className="text-gray-600 text-sm">See environmental risks, pollution zones, and detailed summaries.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Get Recommendations</h3>
              <p className="text-gray-600 text-sm">Receive personalized advice based on your location's environmental conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Who Uses GreenGuardian?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-700">
            <h3 className="text-xl font-semibold mb-3">Farmers</h3>
            <p className="text-gray-600 mb-4">
              Make informed decisions about crop planting, irrigation, and pest management based on environmental data and AI recommendations.
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Crop planting calendars
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Plant health analysis
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Weather risk alerts
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-700">
            <h3 className="text-xl font-semibold mb-3">Urban Planners</h3>
            <p className="text-gray-600 mb-4">
              Identify high-risk areas, monitor pollution trends, and plan green infrastructure based on environmental data.
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pollution heat maps
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Risk zone analysis
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Historical trend data
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-700">
            <h3 className="text-xl font-semibold mb-3">Citizens</h3>
            <p className="text-gray-600 mb-4">
              Understand local environmental conditions, receive health advisories, and make informed decisions about outdoor activities.
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Air quality monitoring
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Health risk advisories
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Personalized recommendations
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-700 text-white rounded-xl overflow-hidden">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">Ready to monitor your environment?</h2>
              <p className="text-green-100">Start exploring environmental data in your area today.</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/map" className="px-6 py-3 bg-white text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors shadow-md">
                Explore Map
              </Link>
              <Link to="/farming" className="px-6 py-3 bg-green-900 text-white font-medium rounded-lg hover:bg-green-800 transition-colors shadow-md border border-green-600">
                Try Farming Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
