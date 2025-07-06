import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ChatSection } from './components/ChatSection';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { Journal } from './components/Journal';

function App() {
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

export default App;