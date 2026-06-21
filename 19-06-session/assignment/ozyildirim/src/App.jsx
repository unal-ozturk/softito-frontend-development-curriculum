import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import VehicleDetail from './components/VehicleDetail.jsx';
import Reservation from './components/Reservation.jsx';
import Success from './components/Success.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';

import { MOCK_VEHICLES } from './data.js';

export default function App() {
  const [view, setView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleVehicleSelect = (v) => {
    setSelectedVehicle(v);
    setView('detail');
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header 
          setView={setView} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
      />
      
      <main className="page-container">
          {view === 'home' && (
            <Home 
              vehicles={MOCK_VEHICLES}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onVehicleClick={handleVehicleSelect}
            />
          )}

          {view === 'detail' && (
            <VehicleDetail 
              vehicle={selectedVehicle} 
              onReserveClick={() => setView('reservation')}
              setView={setView}
            />
          )}

          {view === 'reservation' && (
            <Reservation 
              vehicle={selectedVehicle} 
              onSuccess={() => setView('success')}
              setView={setView}
            />
          )}

          {view === 'success' && (
            <Success 
              vehicle={selectedVehicle}
              onHomeClick={() => setView('home')} 
              setView={setView}
            />
          )}

          {view === 'about' && <About />}
          
          {view === 'contact' && <Contact />}
      </main>

      <Footer setView={setView} />
    </div>
  );
}
