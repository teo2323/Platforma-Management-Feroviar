import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Snowflake, 
  Wifi, 
  Plug, 
  BaggageClaim, 
  Info, 
  TrainFront,
  ChevronRight,
  X,
  Users
} from 'lucide-react';

const WagonWeb = () => {
  const [trenuri, setTrenuri] = useState([]);
  const [selectedTrenId, setSelectedTrenId] = useState('');
  const [trenData, setTrenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVagon, setSelectedVagon] = useState(null);

  // 1. Preluam lista de trenuri pentru dropdown
  useEffect(() => {
    const fetchTrenuri = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/trenuri');
        setTrenuri(res.data);
      } catch (err) {
        console.error("Eroare la preluarea trenurilor:", err);
        setError("Nu am putut încărca lista de trenuri. Verifică conexiunea cu serverul.");
      }
    };
    fetchTrenuri();
  }, []);

  // 2. Cand se alege un tren, preluam detaliile complete
  useEffect(() => {
    if (!selectedTrenId) {
      setTrenData(null);
      return;
    }

    const fetchTrenDetails = async () => {
      setLoading(true);
      setError('');
      setSelectedVagon(null); // resetam vagonul selectat
      try {
        const res = await axios.get(`http://localhost:8080/api/trenuri/${selectedTrenId}`);
        // Endpoint-ul poate returna un array cu un singur element sau direct obiectul. Ne asiguram:
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setTrenData(data);
      } catch (err) {
        console.error("Eroare la preluarea compozitiei:", err);
        setError("Eroare la preluarea datelor trenului selectat.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrenDetails();
  }, [selectedTrenId]);

  // Helper pentru a asocia iconite in functie de nume
  const getFacilityIcon = (facility) => {
    const name = facility.toLowerCase();
    if (name.includes('ac') || name.includes('aer conditionat')) return <Snowflake size={16} />;
    if (name.includes('wi-fi') || name.includes('wifi')) return <Wifi size={16} />;
    if (name.includes('priza') || name.includes('220v')) return <Plug size={16} />;
    if (name.includes('bagaje')) return <BaggageClaim size={16} />;
    return <Info size={16} />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 py-10 space-y-10">
      
      {/* Header Page */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 drop-shadow-sm pb-2">
          Compoziție Trenuri
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          Vizualizează schița și dotările fiecărui vagon în stilul vagonWEB.
        </p>
      </div>

      {/* Selector Tren */}
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white max-w-2xl mx-auto relative z-10">
        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
          Alege un tren
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
            <TrainFront size={24} />
          </div>
          <select
            value={selectedTrenId}
            onChange={(e) => setSelectedTrenId(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-800 appearance-none"
          >
            <option value="">-- Selectează Trenul --</option>
            {trenuri.map((tren) => (
              <option key={tren.idTren} value={tren.idTren}>
                {tren.idTren} - {tren.tipTren}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-4 text-red-500 font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
      </div>

      {/* Zona de afisare compozitie */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : trenData ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Informatii generale tren */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-4 rounded-full">
                <TrainFront size={40} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight">{trenData.idTren}</h3>
                <p className="text-blue-300 font-bold tracking-widest uppercase text-sm">{trenData.tipTren}</p>
              </div>
            </div>
            <div className="bg-slate-950/50 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <Users className="text-slate-400" size={24} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Capacitate Totală</p>
                <p className="text-xl font-black">{trenData.capacitateTotala} locuri</p>
              </div>
            </div>
          </div>

          {/* Schita Trenului (Orizontal) */}
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[3rem] shadow-lg border border-white overflow-hidden">
            <h4 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-2">
              Schiță Garnitură
              <span className="text-sm font-medium text-slate-400 font-normal ml-2 tracking-wide">(Scroll orizontal)</span>
            </h4>
            
            <div className="flex items-end overflow-x-auto pb-8 pt-4 custom-scrollbar gap-2 snap-x">
              
              {/* Locomotiva */}
              <div className="snap-start shrink-0 relative flex flex-col items-center justify-end h-40 w-48 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-tl-3xl rounded-tr-lg rounded-b-md shadow-lg border-b-4 border-slate-900 z-10">
                 <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-300 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.8)]"></div>
                 <div className="absolute top-1/2 left-4 w-12 h-10 bg-slate-800/80 rounded-sm"></div>
                 <div className="text-white/50 font-black text-2xl tracking-tighter absolute bottom-4 left-4">LOCO</div>
                 {/* Roti locomotiva */}
                 <div className="absolute -bottom-4 flex gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-600 bg-slate-800"></div>
                    <div className="w-8 h-8 rounded-full border-4 border-slate-600 bg-slate-800"></div>
                    <div className="w-8 h-8 rounded-full border-4 border-slate-600 bg-slate-800"></div>
                 </div>
              </div>

              {/* Legatura Locomotiva-Vagon */}
              <div className="w-4 h-2 bg-slate-800 shrink-0 mb-4 rounded-sm"></div>

              {/* Vagoanele */}
              {trenData.vagoane?.map((vagon, index) => {
                const isClasa1 = vagon.clasa === 1;
                const isSelected = selectedVagon?.id_vagon === vagon.id_vagon;
                
                return (
                  <React.Fragment key={vagon.id_vagon}>
                    <div 
                      onClick={() => setSelectedVagon(vagon)}
                      className={`snap-start shrink-0 relative h-36 w-64 bg-slate-50 rounded-t-xl rounded-b-md border-2 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                        ${isSelected ? 'border-blue-500 shadow-xl shadow-blue-500/20 scale-105 z-20' : 'border-slate-300 shadow-md z-10'}
                      `}
                    >
                      {/* Banda de clasa */}
                      <div className={`absolute top-0 left-0 w-full h-3 rounded-t-[10px] ${isClasa1 ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
                      
                      {/* Ferestre */}
                      <div className="absolute top-6 left-0 w-full flex justify-evenly px-2">
                        {[...Array(4)].map((_, i) => (
                           <div key={i} className={`w-10 h-8 rounded-sm ${isSelected ? 'bg-blue-100' : 'bg-slate-200'} border-b-2 border-slate-300`}></div>
                        ))}
                      </div>

                      {/* Info vagon pe exterior */}
                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                        <div className="font-black text-3xl text-slate-800 tracking-tighter opacity-80">{vagon.numarVagon}</div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-md ${isClasa1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          Clasa {vagon.clasa}
                        </div>
                      </div>

                      {/* Roti vagon */}
                      <div className="absolute -bottom-3 left-4 flex gap-1">
                        <div className="w-6 h-6 rounded-full border-[3px] border-slate-400 bg-slate-700"></div>
                        <div className="w-6 h-6 rounded-full border-[3px] border-slate-400 bg-slate-700"></div>
                      </div>
                      <div className="absolute -bottom-3 right-4 flex gap-1">
                        <div className="w-6 h-6 rounded-full border-[3px] border-slate-400 bg-slate-700"></div>
                        <div className="w-6 h-6 rounded-full border-[3px] border-slate-400 bg-slate-700"></div>
                      </div>
                    </div>

                    {/* Cuplaj intre vagoane (daca nu e ultimul) */}
                    {index < trenData.vagoane.length - 1 && (
                      <div className="w-4 h-2 bg-slate-600 shrink-0 mb-4 rounded-sm"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-6">Apasă pe un vagon pentru detalii</p>
          </div>

          {/* Panou Detalii Vagon Selectat */}
          {selectedVagon && (
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-blue-50 relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedVagon(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className={`p-6 rounded-3xl shrink-0 flex flex-col justify-center items-center w-32 h-32 text-white shadow-inner ${selectedVagon.clasa === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                   <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Vagon</span>
                   <span className="text-6xl font-black drop-shadow-md">{selectedVagon.numarVagon}</span>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="text-2xl font-black text-slate-800">Detalii Vagon</h4>
                    <div className="flex gap-4 mt-2">
                      <span className={`px-3 py-1 text-sm font-bold rounded-full ${selectedVagon.clasa === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        Clasa {selectedVagon.clasa}
                      </span>
                      <span className="px-3 py-1 text-sm font-bold rounded-full bg-slate-100 text-slate-600">
                        {selectedVagon.numarLocuri} de locuri
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Facilități incluse</h5>
                    <div className="flex flex-wrap gap-3">
                      {selectedVagon.facilitati?.map((fac, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                          <span className="text-blue-500">{getFacilityIcon(fac)}</span>
                          {fac}
                        </div>
                      ))}
                      {(!selectedVagon.facilitati || selectedVagon.facilitati.length === 0) && (
                        <span className="text-slate-400 italic font-medium">Nicio facilitate specială listată.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};

export default WagonWeb;