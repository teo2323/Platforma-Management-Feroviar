import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const trainIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4540/4540243.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const HartaPage = () => {
  const [trenuriLive, setTrenuriLive] = useState([]);
  //const [calamitati, setCalamitati] = useState([]); // Aici vom stoca calamitatile de la backend

  useEffect(() => {
    const fetchLiveMap = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/harta/live');
        setTrenuriLive(res.data);
      } catch (err) {
        console.error("Eroare date harta:", err);
      }
    };
    fetchLiveMap();
    const interval = setInterval(fetchLiveMap, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 py-10">
      
      {/* Header imbunatatit pentru Harta */}
      <div className="flex items-center gap-5 mb-10 bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-lg shadow-slate-200/50">
        <div className="bg-red-500/10 p-4 rounded-2xl relative">
          <div className="absolute inset-0 bg-red-400/20 rounded-2xl animate-ping"></div>
          <span className="text-3xl relative z-10">📡</span>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-blue-800 drop-shadow-sm">
            Hartă Live & Calamități
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Urmărește trenurile în timp real și monitorizează eventualele incidente de pe traseu.
          </p>
        </div>
      </div>

      {/* Container-ul hartii cu border mare (Efect de rama), shadow avansat si hover states */}
      <div className="h-[75vh] w-full rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border-[8px] md:border-[12px] border-white/80 bg-slate-100 z-0 relative hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.25)] hover:border-white transition-all duration-500">
        <MapContainer center={[45.9432, 24.9668]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Randare calamitati (ex: sub forma de CircleMarker sau Marker normal) 
              calamitati.map(calamitate => ...) */}

          {trenuriLive.map((tren) => (
            <Marker 
              key={tren.id} 
              position={[tren.latitudine, tren.longitudine]} 
              icon={trainIcon}
            >
              <Popup className="rounded-xl overflow-hidden shadow-2xl border-0">
                <div className="text-center p-2 min-w-[150px]">
                  <p className="font-black text-blue-600 text-sm uppercase tracking-widest mb-1">
                    Tren: {tren?.instantaCalatorie?.tren?.idTren || "N/A"}
                  </p>
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>
                  
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                      <span className="text-xs font-bold text-slate-500">Viteză</span>
                      <span className="text-xs font-black text-slate-900">{tren?.viteza} km/h</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-red-50 p-2 rounded-lg">
                      <span className="text-xs font-bold text-red-400">Întârziere</span>
                      <span className="text-xs font-black text-red-600 italic">
                        {tren?.instantaCalatorie?.intarziereMinute || 0} min
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
    </div>
  );
};

export default HartaPage;