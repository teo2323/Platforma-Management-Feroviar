import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Sparkles, MapPin, Navigation } from 'lucide-react';

const HomePage = () => {
  const [statii, setStatii] = useState([]);
  const [plecare, setPlecare] = useState("");
  const [destinatie, setDestinatie] = useState("");
  const [rute, setRute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expertiza, setExpertiza] = useState("");

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
    setExpertiza("");
    try {
      const res = await axios.get(`http://localhost:8080/api/rute/cauta?plecare=${plecare}&destinatie=${destinatie}`);
      setRute(res.data.rute || []);
      setExpertiza(res.data.expertizaGenerala || "");
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
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 drop-shadow-sm pb-2">
          Încotro călătorești?
        </h2>
        <p className="text-neutral-400 font-medium text-lg">
          Găsește cele mai rapide rute și beneficiază de recomandările asistentului nostru inteligent Smart AI.
        </p>
      </div>

      {/* Formular de cautare imbunatatit cu glassmorphism si hover states */}
      <div className="bg-neutral-800/80 backdrop-blur-md p-4 md:p-6 rounded-[2.5rem] shadow-xl shadow-black/50 border border-neutral-700 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto relative z-10 hover:shadow-2xl hover:shadow-yellow-500/10 transition-shadow duration-500">
        
        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-yellow-400 transition-colors">
            <MapPin size={20} />
          </div>
          <select 
            onChange={(e) => setPlecare(e.target.value)} 
            value={plecare}
            className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-700 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all cursor-pointer text-neutral-200 appearance-none"
          >
            <option value="">Plecare...</option>
            {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
          </select>
        </div>

        <div className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-yellow-400 transition-colors">
            <Navigation size={20} />
          </div>
          <select 
            onChange={(e) => setDestinatie(e.target.value)} 
            value={destinatie}
            className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-700 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all cursor-pointer text-neutral-200 appearance-none"
          >
            <option value="">Destinație...</option>
            {statii.map(s => <option key={s.id} value={s.numeStatie}>{s.numeStatie}</option>)}
          </select>
        </div>

        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 md:px-10 rounded-2xl text-black shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:from-yellow-300 hover:to-yellow-400 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center group"
        >
          {loading ? (
            <div className="animate-spin w-6 h-6 border-4 border-black border-t-transparent rounded-full"></div>
          ) : (
            <Search className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Cardurile de rezultate imbunatatite vizual */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {expertiza && (
          <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 border-l-4 border-yellow-500 p-6 rounded-3xl shadow-md flex gap-4 items-start shadow-black/30">
            <div className="bg-neutral-800 p-2 rounded-full shadow-sm text-yellow-400 border border-neutral-700">
              <Sparkles className="animate-pulse" size={20} />
            </div>
            <div>
              <h4 className="font-black text-yellow-500 text-xs uppercase tracking-widest mb-1">
                Expertiză Generală Smart Rail (AI)
              </h4>
              <p className="text-neutral-300 text-sm font-semibold leading-relaxed">
                {expertiza}
              </p>
            </div>
          </div>
        )}

        {rute.length > 0 ? rute.map((ruta) => (
          <div key={ruta.idRuta} className="bg-neutral-800/80 backdrop-blur-sm p-6 md:p-8 rounded-[3rem] shadow-lg shadow-black/50 border border-neutral-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/15 transition-all duration-500 ease-out group">
            
            <div className="flex justify-between items-center mb-8 border-b border-neutral-700 pb-4">
              <h3 className="font-black text-3xl tracking-tighter text-neutral-100 drop-shadow-sm flex items-center gap-3">
                <span className="text-yellow-400">🚆</span> {ruta?.tren?.idTren || "N/A"}
              </h3>
              <span className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-4 py-1.5 rounded-full font-bold italic uppercase text-xs tracking-wider shadow-sm">
                {ruta?.tren?.tipTren}
              </span>
            </div>

            {ruta.recomandareAi && (
              <div className="mb-8 p-5 md:p-6 bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-sm border-l-4 border-yellow-400 rounded-r-3xl flex gap-4 items-start shadow-inner">
                <div className="bg-neutral-800 p-2 rounded-full shadow-sm border border-neutral-700">
                  <Sparkles className="text-yellow-400 shrink-0" size={20} />
                </div>
                <div className="text-sm text-neutral-300 leading-relaxed font-medium">
                  <span className="font-black text-yellow-400 uppercase text-[10px] block mb-1.5 tracking-widest">
                    Analiză Smart AI
                  </span>
                  {ruta.recomandareAi}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-center bg-gradient-to-r from-neutral-900 to-neutral-800/50 p-6 rounded-3xl border border-neutral-700 group-hover:border-yellow-400/50 transition-colors">
              <div className="flex-1">
                <p className="text-3xl font-black text-neutral-100 drop-shadow-sm">{getOra(ruta.opriri, plecare, 'plecare')}</p>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">{plecare || "Sursa"}</p>
              </div>
              
              <div className="flex-[2] flex flex-col items-center justify-center px-4 md:px-8">
                <div className="w-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 relative rounded-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-800 px-3 py-1 rounded-full text-yellow-400 shadow-sm border border-neutral-600 text-xs font-bold tracking-widest uppercase">
                      Direct
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-3xl font-black text-neutral-100 drop-shadow-sm">{getOra(ruta.opriri, destinatie, 'sosire')}</p>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">{destinatie || "Destinatie"}</p>
              </div>
            </div>
            
          </div>
        )) : (
          <div className="text-center py-24 bg-neutral-800/50 backdrop-blur-sm border-4 border-dashed border-neutral-700 rounded-[3rem] text-neutral-400 font-medium italic shadow-inner">
            <div className="text-6xl mb-4 opacity-50">🧭</div>
            Selectați stațiile de plecare și destinație pentru a vizualiza rutele disponibile
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;