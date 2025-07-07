import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to the Unified Farm Management System
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          Your all-in-one platform for modern agriculture, integrating AI-powered insights, crop simulation, cattle management, environmental monitoring, and genetic analysis.
        </p>
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Our Modules:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/aigardenadvisor" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <h3 className="text-xl font-semibold text-green-700 mb-2">AI Garden Advisor</h3>
              <p className="text-gray-600">Get intelligent advice for your garden and crops.</p>
            </Link>
            <Link href="/cropsimulation" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Crop Simulation</h3>
              <p className="text-gray-600">Simulate crop growth under various conditions.</p>
            </Link>
            <Link href="/cattlefarmmanagement" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">Cattle Farm Management</h3>
              <p className="text-gray-600">Manage your cattle farm operations efficiently.</p>
            </Link>
            <Link href="/greenguardian/dashboard" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Green Guardian</h3>
              <p className="text-gray-600">Monitor environmental data and risks.</p>
            </Link>
            <Link href="/crisp" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              <h3 className="text-xl font-semibold text-red-700 mb-2">Crisp</h3>
              <p className="text-gray-600">Analyze crop gene information.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
