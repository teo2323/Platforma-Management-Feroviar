import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HartaPage from './pages/HartaPage';
import WagonWeb from './pages/WagonWeb';

const App = () => { 
  // Forțăm body-ul să aibă fundal închis permanent pentru a evita spațiile albe la scroll
  useEffect(() => {
    document.body.style.backgroundColor = '#171717'; // echivalentul lui neutral-900
    document.body.style.color = '#f5f5f5';
  }, []);

  return (
    <Router>
      {}
      
      <div className="min-h-screen bg-neutral-900 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-800 to-black font-sans text-neutral-100 selection:bg-yellow-400 selection:text-black">
        <Navbar />
        <main className="transition-all duration-500 ease-in-out">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/harta" element={<HartaPage />} />
            <Route path="/compozitie/:id" element={<WagonWeb />} />
            <Route path="/compozitie" element={<WagonWeb />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;