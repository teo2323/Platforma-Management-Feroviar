import React from 'react';
import { NavLink } from 'react-router-dom';
import { Train, Map, LayoutDashboard, TrainFront } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo și Titlu */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-2xl shadow-lg shadow-yellow-500/20 border border-yellow-300/50">
              <TrainFront className="text-black" size={32} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-tighter uppercase leading-none">
                Platforma de Management
              </span>
              <span className="text-neutral-400 font-bold text-sm tracking-widest uppercase">
                Feroviar
              </span>
            </div>
          </div>

          {/* Butoane Navigație (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-105'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-yellow-400 active:scale-95'
                  }`
                }
              >
                <LayoutDashboard size={20} />
                Acasă
              </NavLink>

              <NavLink
                to="/harta"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-105'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-yellow-400 active:scale-95'
                  }`
                }
              >
                <Map size={20} />
                Hartă Live
              </NavLink>

              <NavLink
                to="/compozitie"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-105'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-yellow-400 active:scale-95'
                  }`
                }
              >
                <Train size={20} />
                Compoziție
              </NavLink>
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;