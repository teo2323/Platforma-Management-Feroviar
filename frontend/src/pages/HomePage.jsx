import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Sparkles, MapPin, Navigation } from 'lucide-react';

const HomePage = () => {
  const [statii, setStatii] = useState([]);
  const [plecare, setPlecare] = useState("");
  const [destinatie, setDestinatie] = useState("");
  const [rute, setRute] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-7xl mx-auto p-6 space-y-12 py-12">
      
      {/* Header/Hero sectiune adaugata pentru a da un aer mai premium */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 drop-shadow-sm pb-2">
          Încotro călătorești?
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          Găsește cele mai rapide rute și beneficiază de recomandările asistentului nostru inteligent Smart AI.
        </p>
      </div>

      {/* Formular de cautare imbunatatit cu glassmorphism si hover states */}
      <div className="bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col md:flex-row gap-4 max-w-4xl mx-auto relative z-10 hover:shadow-2xl hover:shadow-blue-500/10 transition-shadow duration-500">
        
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
            <MapPin size={20} />
          </div>
          <select 
            onChange={(e) => setPlecare(e.target.value)} 
            value={plecare}
            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700 appearance-none"
          >
            <option value="">Plecare...</option>
            {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
          </select>
        </div>

        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
            <Navigation size={20} />
          </div>
          <select 
            onChange={(e) => setDestinatie(e.target.value)} 
            value={destinatie}
            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700 appearance-none"
          >
            <option value="">Destinație...</option>
            {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
          </select>
        </div>

        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 md:px-10 rounded-2xl text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center group"
        >
          {loading ? (
            <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
          ) : (
            <Search className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Cardurile de rezultate imbunatatite vizual */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {rute.length > 0 ? rute.map((ruta) => (
          <div key={ruta.idRuta} className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-[3rem] shadow-lg shadow-slate-200/50 border border-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 ease-out group">
            
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h3 className="font-black text-3xl tracking-tighter text-slate-800 drop-shadow-sm flex items-center gap-3">
                <span className="text-blue-500">🚆</span> {ruta?.tren?.idTren || "N/A"}
              </h3>
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-bold italic uppercase text-xs tracking-wider shadow-sm">
                {ruta?.tren?.tipTren}
              </span>
            </div>

            {ruta.recomandareAi && (
              <div className="mb-8 p-5 md:p-6 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-l-4 border-indigo-500 rounded-r-3xl flex gap-4 items-start shadow-inner">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Sparkles className="text-indigo-600 shrink-0" size={20} />
                </div>
                <div className="text-sm text-indigo-900 leading-relaxed font-medium">
                  <span className="font-black text-indigo-700 uppercase text-[10px] block mb-1.5 tracking-widest">
                    Analiză Smart AI
                  </span>
                  {ruta.recomandareAi}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-center bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 rounded-3xl border border-slate-100 group-hover:border-blue-100 transition-colors">
              <div className="flex-1">
                <p className="text-3xl font-black text-slate-800 drop-shadow-sm">{getOra(ruta.opriri, plecare, 'plecare')}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{plecare || "Sursa"}</p>
              </div>
              
              <div className="flex-[2] flex flex-col items-center justify-center px-4 md:px-8">
                <div className="w-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300 relative rounded-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full text-blue-500 shadow-sm border border-slate-100 text-xs font-bold tracking-widest uppercase">
                      Direct
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-3xl font-black text-slate-800 drop-shadow-sm">{getOra(ruta.opriri, destinatie, 'sosire')}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{destinatie || "Destinatie"}</p>
              </div>
            </div>
            
          </div>
        )) : (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm border-4 border-dashed border-slate-200 rounded-[3rem] text-slate-400 font-medium italic shadow-inner">
            <div className="text-6xl mb-4 opacity-50">🧭</div>
            Selectați stațiile de plecare și destinație pentru a vizualiza rutele disponibile
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;