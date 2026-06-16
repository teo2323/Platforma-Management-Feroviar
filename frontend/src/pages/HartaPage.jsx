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

const COORDONATE_STATII = {
  "Bucuresti Nord": [44.4468, 26.0750],
  "Ploiesti Vest": [44.9257, 25.9928],
  "Sinaia": [45.3552, 25.5539],
  "Predeal": [45.5036, 25.5786],
  "Brasov": [45.6525, 25.6111],
  "Constanta": [44.1792, 28.6498],
  "Fetesti": [44.3820, 27.8286],
  "Fagaras": [45.8416, 24.9734],
  "Sibiu": [45.7983, 24.1614],
  "Deva": [45.8824, 22.9069],
  "Arad": [46.1866, 21.3123],
  "Timisoara": [45.7504, 21.2257],
  "Rosiori Nord": [44.1207, 24.9847],
  "Craiova": [44.3302, 23.8185],
  "Drobeta-Turnu Severin": [44.6259, 22.6566],
  "Caransebes": [45.4190, 22.2037],
  "Cluj-Napoca": [46.7772, 23.5898],
  "Oradea": [47.0735, 21.9406],
  "Satu Mare": [47.7884, 22.8870],
  "Iasi": [47.1585, 27.6014],
  "Pascani": [47.2500, 26.7167],
  "Suceava": [47.6514, 26.2556],
  "Bacau": [46.5688, 26.9159],
  "Focsani": [45.7001, 27.1820],
  "Buzau": [45.1516, 26.8167],
  "Galati": [45.4353, 28.0553],
  "Braila": [45.2692, 27.9575],
  "Baia Mare": [47.6533, 23.5794],
  "Dej Calatori": [47.1492, 23.8694]
};

const HartaPage = () => {
  const [trenuriLive, setTrenuriLive] = useState([]);
  const [calamitati, setCalamitati] = useState([]);
  const [statii, setStatii] = useState([]);

  useEffect(() => {
    const fetchStatii = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/statii');
        setStatii(res.data);
      } catch (err) {
        console.error("Eroare la incarcarea statiilor:", err);
      }
    };
    fetchStatii();
  }, []);

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

  useEffect(() => {
    const fetchCalamitati = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/calamitati');
        setCalamitati(res.data);
      } catch (err) {
        console.error("Eroare date calamitati:", err);
      }
    };
    fetchCalamitati();
    const interval = setInterval(fetchCalamitati, 10000);
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
          
          {statii.map((statie) => {
            const coords = COORDONATE_STATII[statie.numeStatie];
            if (!coords) return null;
            
            const stationIcon = L.divIcon({
              html: `<div style="font-size: 20px; line-height: 1; text-shadow: 0 0 4px white; cursor: pointer;" title="${statie.numeStatie}">🚉</div>`,
              className: 'station-icon',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            return (
              <Marker 
                key={`statie-${statie.id}`} 
                position={coords} 
                icon={stationIcon}
              >
                <Popup className="rounded-xl overflow-hidden shadow-md border-0">
                  <div className="p-2 text-center font-black text-slate-800 text-xs">
                    Gara: {statie.numeStatie}
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {calamitati.map((cal, idx) => {
            const calamityIcon = L.divIcon({
              html: `<div style="font-size: 28px; line-height: 1; text-shadow: 0 0 5px white; cursor: pointer;">${cal.icon}</div>`,
              className: 'calamity-icon',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            });
            return (
              <Marker 
                key={`cal-${idx}`} 
                position={[Number(cal.latitudine) + 0.015, Number(cal.longitudine) + 0.015]} 
                icon={calamityIcon}
              >
                <Popup className="rounded-[1.5rem] overflow-hidden shadow-2xl border-0">
                  <div className="text-center p-2 min-w-[170px]">
                    <p className="font-black text-red-600 text-sm uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                      🚨 Incident
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {cal.tipCalamitate.replace(/_/g, ' ')}
                    </p>
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-200 to-transparent my-2"></div>
                    
                    <div className="flex flex-col gap-2 mt-3">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                        <span className="text-xs font-bold text-slate-500">Stație</span>
                        <span className="text-xs font-black text-slate-900">{cal.numeStatie}</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-red-50 p-2 rounded-lg">
                        <span className="text-xs font-bold text-red-400">Raportat</span>
                        <span className="text-xs font-black text-red-600">
                          {new Date(cal.dataAparitie).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {trenuriLive.map((tren) => (
            <Marker 
              key={tren.id} 
              position={[tren.latitudine, tren.longitudine]} 
              icon={trainIcon}
            >
              <Popup className="rounded-xl overflow-hidden shadow-2xl border-0">
                <div className="text-center p-2 min-w-[150px]">
                  <p className="font-black text-blue-600 text-sm uppercase tracking-widest mb-1">
                    Tren: {tren?.instantaCalatorie?.rutaProgramata?.tren?.idTren || "N/A"}
                  </p>
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>
                  
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                      <span className="text-xs font-bold text-slate-500">Viteză</span>
                      <span className="text-xs font-black text-slate-900">{tren?.viteza} km/h</span>
                    </div>

                    <div className="flex flex-col bg-slate-50 p-2 rounded-lg text-left gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Status Traseu</span>
                      <div className="text-[11px] font-black text-slate-800 flex flex-col gap-1 mt-1">
                        <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1">
                          <span className="font-medium text-slate-500 flex items-center gap-1">
                            <span className="text-[8px]">🟢</span> Plecat din
                          </span>
                          <span className="font-black text-slate-800">{tren?.ultimaStatie || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-medium text-slate-500 flex items-center gap-1">
                            <span className="text-[8px]">🔵</span> Urmează
                          </span>
                          <span className="font-black text-slate-800">{tren?.urmatoareaStatie || "N/A"}</span>
                        </div>
                      </div>
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