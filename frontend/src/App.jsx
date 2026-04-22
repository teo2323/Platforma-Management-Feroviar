import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Train, AlertTriangle, Info, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';


import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const App = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
    
      const response = await axios.get('http://localhost:8080/api/trenuri/search');
      setTrains(response.data);
    } catch (error) {
      console.error("Eroare la conectarea cu Backend-ul:", error);
      alert("⚠️ Backend-ul nu răspunde pe portul 8080. Verifică dacă serverul lui Teo este pornit!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {}
      <nav className="bg-slate-900 text-white p-4 shadow-2xl sticky top-0 z-[1001]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <Train size={32} className="text-blue-500" /> SMART RAIL
          </h1>
          <div className="flex gap-4">
            <span className="text-[10px] font-bold bg-blue-600 px-3 py-1 rounded-full uppercase tracking-[0.2em]">AI Assistant Live</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 w-full flex-1">
        {}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-8 mt-4 transition-all hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Stație Plecare</label>
              <input type="text" defaultValue="București Nord" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Stație Destinație</label>
              <input type="text" defaultValue="Brașov" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold" />
            </div>
            <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-200 uppercase flex items-center justify-center gap-2 active:scale-95">
              <Search size={20} />
              {loading ? "Se caută..." : "Caută Trenuri"}
            </button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {}
          <div className="space-y-6">
            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 ml-2">
              <Info size={24} className="text-blue-600" /> RECOMANDĂRI SMART AI
            </h2>
            
            {trains.length > 0 ? trains.map((t) => (
              <div key={t.id_tren} className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 hover:border-blue-300 transition-all group overflow-hidden relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">{t.id_tren}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.tip_tren}</p>
                  </div>
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                    +{t.status_live.intarziere_minute} min
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-100 p-5 rounded-2xl flex gap-4 shadow-inner relative">
                  <AlertTriangle className="text-blue-600 shrink-0" size={24} />
                  <p className="text-sm font-bold text-blue-900 leading-relaxed italic">
                    "{t.recomandare_ai}"
                  </p>
                </div>
              </div>
            )) : (
              <div className="bg-slate-100 border-4 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
                <div className="bg-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Train size={32} />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-tight italic">Sistemul este gata. Introdu ruta pentru analiză AI.</p>
              </div>
            )}
          </div>

          {}
          <div className="sticky top-24">
            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 mb-6 ml-2">
              <MapPin size={24} className="text-red-600" /> MONITORIZARE LIVE
            </h2>
            <div className="h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white relative">
              {/* Overlay Alertă AI */}
              <div className="absolute top-6 left-6 right-6 z-[1000] bg-red-600 text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 border-b-4 border-red-800">
                <div className="bg-white/20 p-2 rounded-xl">
                  <AlertTriangle size={28} className="animate-bounce" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tighter">🚨 INCIDENT DETECTAT</p>
                  <p className="text-xs font-bold opacity-90 leading-tight">Copac căzut pe șine între Sinaia și Predeal. Recomandăm evitarea rutei IR-1633.</p>
                </div>
              </div>

              <MapContainer center={[45.43, 25.55]} zoom={9} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[45.45, 25.57]}>
                  <Popup className="font-bold">Locație blocaj feroviar</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

        </div>
      </main>
      
      <footer className="p-8 text-center text-slate-400 text-xs font-bold border-t border-slate-200 bg-white">
        © 2026 SMARTRAIL PROJECT - AI POWERED RAILWAY INFORMATION
      </footer>
    </div>
  );
};

export default App;