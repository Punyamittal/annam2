"use client";

import { useState } from 'react';
import { Navbar } from '../../aigardenadvisor/components/Navbar';
import { Hero } from '../../aigardenadvisor/components/Hero';
import { Features } from '../../aigardenadvisor/components/Features';
import { ChatSection } from '../../aigardenadvisor/components/ChatSection';
import { Testimonials } from '../../aigardenadvisor/components/Testimonials';
import { Footer } from '../../aigardenadvisor/components/Footer';
import { Journal } from '../../aigardenadvisor/components/Journal';

function AiGardenAdvisorPage() {
  const [currentView, setCurrentView] = useState<'home' | 'journal'>('home');

  const showJournal = () => setCurrentView('journal');
  const showHome = () => setCurrentView('home');

  if (currentView === 'journal') {
    return <Journal onBack={showHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar onOpenJournal={showJournal} />
      <Hero />
      <Features />
      <ChatSection onOpenJournal={showJournal} />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default AiGardenAdvisorPage;