import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">GreenGuardian</h3>
              <p className="text-sm text-green-200">AI-powered environmental monitoring</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 hover:text-white">
                About
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-green-300">
            &copy; {new Date().getFullYear()} GreenGuardian. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
