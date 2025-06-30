import React from 'react';
import { Leaf as Plant, Cloud, Map, Calendar, BarChart, Thermometer, Droplets, Wind } from 'lucide-react';
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
    <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Plant className="h-6 w-6 text-green-600" />,
      title: "Personalized Plant Selection",
      description: "Get recommendations for vegetables, fruits, and herbs that will thrive in your specific garden conditions."
    },
    {
      icon: <Map className="h-6 w-6 text-green-600" />,
      title: "Location-Based Advice",
      description: "Receive guidance tailored to your climate zone, growing season, and local conditions."
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      title: "Planting Calendar",
      description: "Know exactly when to plant each crop for optimal growth and yield in your region."
    },
    {
      icon: <Cloud className="h-6 w-6 text-green-600" />,
      title: "Weather Integration",
      description: "Our AI considers local weather patterns and forecasts to provide timely planting advice."
    },
    {
      icon: <BarChart className="h-6 w-6 text-green-600" />,
      title: "Growth Tracking",
      description: "Monitor your plants' progress and receive care reminders throughout the growing season."
    },
    {
      icon: <Thermometer className="h-6 w-6 text-green-600" />,
      title: "Climate Adaptation",
      description: "Learn strategies to adapt your garden to changing climate conditions in your area."
    },
    {
      icon: <Droplets className="h-6 w-6 text-green-600" />,
      title: "Water Management",
      description: "Get advice on efficient watering practices based on your soil type and plant selection."
    },
    {
      icon: <Wind className="h-6 w-6 text-green-600" />,
      title: "Pest & Disease Control",
      description: "Identify common garden pests and diseases with AI-powered solutions for prevention and treatment."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Smart Features for Successful Gardens</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Our AI-powered platform provides everything you need to plan, plant, and maintain a thriving spring garden.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};