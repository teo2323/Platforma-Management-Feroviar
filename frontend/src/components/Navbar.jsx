import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Train } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl text-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)] sticky top-0 z-[1001] border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        
        {/* Logo imbunatatit cu efect de hover pe iconita si text gradient */}
        <h1 className="text-2xl font-black tracking-tighter italic flex items-center group cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-xl mr-3 group-hover:-rotate-12 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
            <Train className="text-white" size={24} />
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
            SMART RAIL
          </span>
        </h1>

        {/* Meniu de tip "Pill" cu fundal semi-transparent si feedback vizual activ */}
        <div className="flex gap-2 sm:gap-4 font-bold bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50 shadow-inner flex-wrap justify-center">
          <Link 
            to="/" 
            className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${isActive('/') ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            Căutare Rute
          </Link>
          <Link 
            to="/harta" 
            className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${isActive('/harta') ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            Hartă Live
          </Link>
          <Link 
            to="/compozitie" 
            className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${isActive('/compozitie') ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            Compoziție Trenuri
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;