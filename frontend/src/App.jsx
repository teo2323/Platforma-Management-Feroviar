import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Train } from 'lucide-react';
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
        console.error("Eroare la încărcarea stațiilor:", err);
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
        console.error("Eroare date live hartă:", err);
      }
    };
    fetchLiveMap();
    const interval = setInterval(fetchLiveMap, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!plecare || !destinatie) {
      alert("Te rog selectează ambele stații!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/rute/cauta?plecare=${plecare}&destinatie=${destinatie}`);
      setRute(res.data);
    } catch (err) {
      console.error("Eroare la căutarea rutei:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOra = (opriri, numeStatie, tip) => {
    const oprire = opriri.find(o => o.statie.numeStatie === numeStatie);
    if (!oprire) return "--:--";
    return tip === 'plecare' ? oprire.oraPlecare.substring(0, 5) : oprire.oraSosire.substring(0, 5);
  };

  const calculeazaDurataRutei = (opriri, start, end) => {
    const oraP = getOra(opriri, start, 'plecare');
    const oraS = getOra(opriri, end, 'sosire');
    if (oraP === "--:--" || oraS === "--:--") return "N/A";

    const [h1, m1] = oraP.split(':').map(Number);
    const [h2, m2] = oraS.split(':').map(Number);
    
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 1440;

    const ore = Math.floor(diff / 60);
    const minute = diff % 60;
    return `${ore}h ${minute}m`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-slate-900 text-white p-5 shadow-2xl sticky top-0 z-[1001]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <Train size={32} className="text-blue-500" /> SMART RAIL <span className="text-blue-500 font-light">SYSTEM</span>
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 w-full flex-1">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Pornire din</label>
              <select 
                value={plecare}
                onChange={(e) => setPlecare(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
              >
                <option value="">Alege stația...</option>
                {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Destinație</label>
              <select 
                value={destinatie}
                onChange={(e) => setDestinatie(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
              >
                <option value="">Alege stația...</option>
                {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
              </select>
            </div>

            <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-200 uppercase flex items-center justify-center gap-3">
              <Search size={20} />
              {loading ? "Se caută..." : "Găsește Rute"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 ml-2 uppercase tracking-tighter">Călătorii Disponibile</h2>
            {rute.length > 0 ? rute.map((ruta) => (
              <div key={ruta.idRuta} className="bg-white p-6 rounded-[2.5rem] shadow-md border border-slate-100 hover:border-blue-400 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{ruta.tren.tipTren}</span>
                    <h3 className="font-black text-3xl text-slate-900 mt-1">{ruta.tren.idTren}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Durată Estimată</p>
                    <p className="font-black text-slate-700">~ {calculeazaDurataRutei(ruta.opriri, plecare, destinatie)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{getOra(ruta.opriri, plecare, 'plecare')}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">{plecare}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4">
                    <div className="w-full h-[2px] bg-slate-300 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                        <Train size={16} className="text-blue-500" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{getOra(ruta.opriri, destinatie, 'sosire')}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">{destinatie}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-slate-100 border-4 border-dashed border-slate-200 rounded-[3rem] p-16 text-center text-slate-400 font-black uppercase italic tracking-tighter">
                Alege stațiile pentru a vedea orarul
              </div>
            )}
          </div>

          <div className="sticky top-28">
             <h2 className="text-xl font-black text-slate-800 mb-6 ml-2 uppercase tracking-tighter">Monitorizare Trafic Live</h2>
             <div className="h-[550px] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white relative">
                <MapContainer center={[45.9432, 24.9668]} zoom={7} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {trenuriLive.map(tren => (
                    <Marker 
                      key={tren.id} 
                      position={[tren.latitudine, tren.longitudine]} 
                      icon={trainIcon}
                    >
                      <Popup>
                        <div className="font-sans">
                          <p className="font-black text-blue-600 uppercase tracking-widest text-xs">Tren activ</p>
                          <p className="text-lg font-bold">Instanță: #{tren.instantaCalatorie.idInstanta}</p>
                          <p className="text-red-500 font-bold italic">Întârziere: {tren.instantaCalatorie.intarziereMinute} min</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;