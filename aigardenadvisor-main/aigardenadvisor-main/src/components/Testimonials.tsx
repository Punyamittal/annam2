import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  rating: number;
  image: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, role, rating, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 mb-6 italic">"{quote}"</p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "The AI recommendations were spot-on for my climate zone. My vegetable garden has never produced better yields!",
      name: "Sarah Johnson",
      role: "Home Gardener",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      quote: "As a first-time gardener, I was lost until I found this app. The personalized advice made everything so much easier.",
      name: "Michael Chen",
      role: "Urban Gardener",
      rating: 5,
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      quote: "I've been gardening for decades, but the AI still taught me new techniques perfect for our changing climate.",
      name: "Eleanor Wright",
      role: "Master Gardener",
      rating: 4,
      image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Gardeners Say</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Join thousands of gardeners who are growing better with AI-powered advice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              rating={testimonial.rating}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};