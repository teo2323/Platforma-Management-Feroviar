import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HartaPage from './pages/HartaPage';

const App = () => { 
  return (
    <Router>
      {}
      
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-blue-50/50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
        <Navbar />
        <main className="transition-all duration-500 ease-in-out">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/harta" element={<HartaPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;