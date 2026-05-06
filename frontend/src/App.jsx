import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Train, Sparkles } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const trainIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4540/4540243.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const App = () => {
  const [statii, setStatii] = useState([]);
  const [plecare, setPlecare] = useState("");
  const [destinatie, setDestinatie] = useState("");
  const [rute, setRute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trenuriLive, setTrenuriLive] = useState([]);

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

  const handleSearch = async () => {
    if (!plecare || !destinatie) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/rute/cauta?plecare=${plecare}&destinatie=${destinatie}`);
      setRute(res.data);
    } catch (err) {
      console.error("Eroare la cautarea rutei:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOra = (opriri, numeStatie, tip) => {
    if (!opriri) return "--:--";
    const oprire = opriri.find(o => o.statie.numeStatie === numeStatie);
    return oprire ? (tip === 'plecare' ? oprire.oraPlecare.substring(0, 5) : oprire.oraSosire.substring(0, 5)) : "--:--";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-slate-900 text-white p-5 shadow-2xl sticky top-0 z-[1001]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter italic">
            <Train className="inline mr-2 text-blue-500" size={32} /> SMART RAIL
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex gap-4">
            <select 
              onChange={(e) => setPlecare(e.target.value)} 
              value={plecare}
              className="flex-1 p-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Plecare...</option>
              {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
            </select>
            <select 
              onChange={(e) => setDestinatie(e.target.value)} 
              value={destinatie}
              className="flex-1 p-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Destinație...</option>
              {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
            </select>
            <button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-blue-600 p-4 rounded-xl text-white hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? <div className="animate-spin">⌛</div> : <Search />}
            </button>
          </div>

          <div className="space-y-4">
            {rute.length > 0 ? rute.map((ruta) => (
              <div key={ruta.idRuta} className="bg-white p-6 rounded-[2.5rem] shadow-md border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-2xl tracking-tighter">{ruta?.tren?.idTren || "N/A"}</h3>
                  <span className="text-blue-600 font-bold italic uppercase text-sm">{ruta?.tren?.tipTren}</span>
                </div>

                {ruta.recomandareAi && (
                  <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl flex gap-3 items-start">
                    <Sparkles className="text-indigo-600 shrink-0" size={20} />
                    <div className="text-sm text-indigo-900 leading-relaxed font-medium">
                      <span className="font-bold text-indigo-700 uppercase text-[10px] block mb-1 tracking-widest">Analiză Smart AI</span>
                      {ruta.recomandareAi}
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-xl font-black text-slate-800">{getOra(ruta.opriri, plecare, 'plecare')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{plecare || "Sursa"}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="w-full h-[1px] bg-slate-300 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2 text-blue-500">🚆</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-800">{getOra(ruta.opriri, destinatie, 'sosire')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{destinatie || "Destinatie"}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-300 font-medium italic border-4 border-dashed border-slate-100 rounded-[3rem]">
                Selectați stațiile pentru a vedea rutele disponibile
              </div>
            )}
          </div>
        </div>

        <div className="h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white sticky top-24 z-0">
          <MapContainer center={[45.9432, 24.9668]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {trenuriLive.map((tren) => (
              <Marker 
                key={tren.id} 
                position={[tren.latitudine, tren.longitudine]} 
                icon={trainIcon}
              >
                <Popup>
                  <div className="text-center p-1">
                    <p className="font-black text-blue-600 text-sm uppercase">Tren: {tren?.instantaCalatorie?.tren?.idTren || "N/A"}</p>
                    <div className="h-[1px] bg-slate-100 my-1"></div>
                    <p className="text-xs font-bold text-slate-600">Viteză: <span className="text-slate-900">{tren?.viteza} km/h</span></p>
                    <p className="text-xs font-bold text-red-500 italic">Întârziere: {tren?.instantaCalatorie?.intarziereMinute || 0} min</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
};

export default App;