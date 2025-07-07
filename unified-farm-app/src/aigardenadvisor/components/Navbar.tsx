import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, BookOpen } from 'lucide-react';
import { scrollToSection } from '../utils/scrollUtils';

interface NavbarProps {
  onOpenJournal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJournal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Chat', href: '#chat-section' },
    { name: 'Testimonials', href: '#testimonials' },
  ];
  
  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="#" className="flex items-center">
                <Leaf className={`h-8 w-8 ${isScrolled ? 'text-green-600' : 'text-green-500'}`} />
                <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-gray-800' : 'text-gray-800'}`}>
                  AI Garden Advisor
                </span>
              </a>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href !== '#') {
                      scrollToSection(link.href.substring(1));
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              {onOpenJournal && (
                <button
                  onClick={onOpenJournal}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Journal
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection('chat-section')}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                ${isScrolled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-600 text-white hover:bg-green-700'}
              `}
            >
              Start Chat
            </button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                if (link.href !== '#') {
                  scrollToSection(link.href.substring(1));
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setIsOpen(false);
              }}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              scrollToSection('chat-section');
              setIsOpen(false);
            }}
            className="w-full mt-4 px-4 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
          >
            Start Chat
          </button>
        </div>
      </div>
    </nav>
  );
};