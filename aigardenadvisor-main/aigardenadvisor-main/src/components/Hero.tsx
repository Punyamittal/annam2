import React from 'react';
import { Sprout } from 'lucide-react';
import { Button } from './Button';
import { scrollToSection } from '../utils/scrollUtils';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-20 md:pt-24 lg:pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content Section */}
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center bg-green-100 px-4 py-2 rounded-full mb-6 animate-fadeIn">
              <Sprout className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 text-sm font-medium">Spring planting season is here!</span>
            </div>
            
            <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">AI Garden Advisor</span>
              <span className="block text-green-600 mt-2">for your garden</span>
            </h1>
            
            <p className="mt-6 text-base text-gray-600 sm:text-lg md:text-xl max-w-2xl">
              Get personalized crop advice for your garden. Our AI-powered advisor helps you choose the right plants based on your location, soil type, and growing conditions.
            </p>
            
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                onClick={() => scrollToSection('chat-section')}
              >
                Start Chat
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="transition-all duration-300"
                onClick={() => scrollToSection('features')}
              >
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative lg:block">
            <div className="relative w-full h-96 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Beautiful garden with various plants and vegetables"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Floating Stats Cards */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                <div className="text-2xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Happy Gardeners</div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-100 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
      
      {/* Background Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-50 to-transparent pointer-events-none"></div>
      
      {/* Mobile Image (shows on smaller screens) */}
      <div className="lg:hidden mt-12 px-4">
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
          <img 
            src="https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2" 
            alt="Beautiful garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};