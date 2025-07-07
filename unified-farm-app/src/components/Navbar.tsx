"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'AI Garden Advisor', href: '/aigardenadvisor' },
    { name: 'Crop Simulation', href: '/cropsimulation' },
    { name: 'Cattle Farm Management', href: '/cattlefarmmanagement' },
    { name: 'Green Guardian', href: '/greenguardian/dashboard' },
    { name: 'Demand Analysis', href: '/demandanalysis' },
    { name: 'Plant Disease Prediction', href: '/plantdiseaseprediction' },
    { name: 'Crisp', href: '/crisp' },
  ];

  return (
    <nav className="bg-green-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Unified Farm App
        </Link>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`text-white hover:text-green-200 transition-colors ${
                  pathname === item.href ? 'font-bold border-b-2 border-green-200' : ''
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;