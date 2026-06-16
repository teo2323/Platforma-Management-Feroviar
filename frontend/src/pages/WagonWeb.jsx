import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Snowflake, 
  Wifi, 
  Plug, 
  BaggageClaim, 
  Bike,
  Coffee,
  Utensils,
  Info, 
  TrainFront,
  ChevronRight,
  X,
  Users,
  Send,
  MessageSquare
} from 'lucide-react';

const WagonWeb = () => {
  const { id: trenIdFromUrl } = useParams();
  const [trenuri, setTrenuri] = useState([]);
  const [selectedTrenId, setSelectedTrenId] = useState(trenIdFromUrl || '');
  const [trenData, setTrenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVagon, setSelectedVagon] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Salut! Sunt asistentul platformei de management feroviar. Întreabă-mă orice despre compoziția trenurilor, clasa vagoanelor sau facilitățile acestora (aer condiționat, prize, Wi-Fi).' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || sending) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setSending(true);

    try {
      const res = await axios.post('http://localhost:8080/api/trenuri/chat', { message: userText });
      const botText = res.data.response || "Nu am primit un răspuns valid de la asistent.";
      setChatMessages(prev => [...prev, { sender: 'bot', text: botText }]);
    } catch (err) {
      console.error("Eroare la comunicarea cu agentul AI:", err);
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Scuze, a apărut o eroare la procesarea solicitării tale. Asigură-te că backend-ul este pornit." }]);
    } finally {
      setSending(false);
    }
  };

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
    if (name.includes('biciclet')) return <Bike size={16} />;
    if (name.includes('priza') || name.includes('prize') || name.includes('220v')) return <Plug size={16} />;
    if (name.includes('bar')) return <Coffee size={16} />;
    if (name.includes('restaurant')) return <Utensils size={16} />;
    return <Info size={16} />;
  };

  // Helper pentru a asocia o locomotiva statica (1-9) in functie de pozitia trenului in lista
  const getLocoImage = (idTren) => {
    if (!idTren || trenuri.length === 0) return "/locomotiva1.png";
    // Gasim pe a cata pozitie se afla trenul selectat in lista de trenuri (0-8)
    const index = trenuri.findIndex(t => t.idTren === idTren);
    const locoIndex = index >= 0 ? (index % 9) + 1 : 1; // Atribuim direct de la 1 la 9
    return `/locomotiva${locoIndex}.png`;
  };

  // Helper pentru a genera numele pozei vagonului bazat pe facilitati
  const getWagonImage = (vagon) => {
    if (!vagon.facilitati || vagon.facilitati.length === 0) {
      return vagon.clasa === 1 ? "/vagon-clasa1.png" : "/vagon-clasa2.png";
    }

    // Standardizăm numele facilităților în "tag-uri" scurte
    const sanitizeFacility = (fac) => {
      const name = fac.toLowerCase();
      if (name.includes('ac') || name.includes('aer conditionat')) return 'ac';
      if (name.includes('wi-fi') || name.includes('wifi')) return 'wifi';
      if (name.includes('priza') || name.includes('220v')) return 'prize';
      if (name.includes('bagaje')) return 'bagaje';
      return name.replace(/[^a-z0-9]/g, ''); // fallback fallback pentru eventuale alte facilitati
    };

    // Extragem tag-urile, le eliminăm pe cele invalide/duplicate și le SORTĂM alfabetic
    const sanitizedFacs = vagon.facilitati.map(sanitizeFacility).filter(Boolean);
    const uniqueSortedFacs = [...new Set(sanitizedFacs)].sort();
    
    return `/${uniqueSortedFacs.join('-')}.png`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 py-10 space-y-10">
      
      {/* Header Page */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 drop-shadow-sm pb-2">
          Compoziție Trenuri
        </h2>
        <p className="text-neutral-400 font-medium text-lg">
          Vizualizează schița și dotările fiecărui vagon în stilul vagonWEB.
        </p>
      </div>

      {/* Selector Tren */}
      <div className="bg-neutral-800/80 backdrop-blur-md p-6 rounded-[2rem] shadow-xl shadow-black/50 border border-neutral-700 max-w-2xl mx-auto relative z-10">
        <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">
          Alege un tren
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-hover:text-yellow-400 transition-colors">
            <TrainFront size={24} />
          </div>
          <select
            value={selectedTrenId}
            onChange={(e) => setSelectedTrenId(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-700 rounded-2xl font-bold text-lg outline-none focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all cursor-pointer text-neutral-200 appearance-none"
          >
            <option value="">-- Selectează Trenul --</option>
            {trenuri.map((tren) => (
              <option key={tren.idTren} value={tren.idTren}>
                {tren.idTren} - {tren.tipTren}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-4 text-red-500 font-medium bg-red-950/50 p-3 rounded-xl border border-red-900/50">{error}</p>}
      </div>

      {/* Zona de afisare compozitie */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
        </div>
      ) : trenData ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Informatii generale tren */}
          <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 text-white p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-yellow-500/30">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400/10 p-4 rounded-full border border-yellow-400/20">
                <TrainFront size={40} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight text-neutral-100">{trenData.idTren}</h3>
                <p className="text-yellow-500 font-bold tracking-widest uppercase text-sm">{trenData.tipTren}</p>
              </div>
            </div>
            <div className="bg-black/50 px-6 py-3 rounded-2xl border border-neutral-700 flex items-center gap-3">
              <Users className="text-neutral-400" size={24} />
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Capacitate Totală</p>
                <p className="text-xl font-black text-yellow-400">{trenData.capacitateTotala} locuri</p>
              </div>
            </div>
          </div>

          {/* Schita Trenului (Orizontal) */}
          <div className="bg-neutral-800/80 backdrop-blur-sm p-8 rounded-[3rem] shadow-lg border border-neutral-700 overflow-hidden">
            <h4 className="font-black text-xl text-neutral-100 mb-6 flex items-center gap-2">
              Schiță Garnitură
              <span className="text-sm font-medium text-neutral-400 font-normal ml-2 tracking-wide">(Scroll orizontal)</span>
            </h4>
            
            <div className="flex items-end overflow-x-auto pb-8 pt-4 custom-scrollbar gap-2 snap-x">
              
              {/* Locomotiva */}
              <div className="snap-start shrink-0 relative flex items-end justify-center h-40 w-56 z-10">
                <img 
                  src={getLocoImage(trenData.idTren)} 
                  alt="Locomotiva" 
                  className="object-contain h-full w-full drop-shadow-xl" 
                  onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3554/3554308.png'; }} 
                />
                <div className="absolute top-2 left-4 bg-black/80 text-yellow-400 text-xs font-black px-2 py-1 rounded shadow-sm backdrop-blur-sm border border-yellow-400/30">LOCO</div>
              </div>

              {/* Vagoanele */}
              {trenData.vagoane?.map((vagon) => {
                const isClasa1 = vagon.clasa === 1;
                const isSelected = selectedVagon?.id_vagon === vagon.id_vagon;
                
                return (
                  <React.Fragment key={vagon.id_vagon}>
                    <div 
                      onClick={() => setSelectedVagon(vagon)}
                      className={`snap-start shrink-0 relative h-36 w-64 cursor-pointer transition-all duration-300 hover:-translate-y-2
                        ${isSelected ? 'scale-105 z-20 drop-shadow-[0_10px_15px_rgba(250,204,21,0.5)]' : 'drop-shadow-md z-10 hover:drop-shadow-xl'}
                      `}
                    >
                      <img 
                        src={getWagonImage(vagon)} 
                        src={isClasa1 ? "/vagon-clasa1.png" : "/vagon-clasa2.png"} 
                        alt={`Vagon Clasa ${vagon.clasa}`} 
                        className={`object-contain h-full w-full rounded-xl transition-all ${isSelected ? 'ring-4 ring-yellow-400 bg-yellow-400/10' : 'bg-transparent'}`}
                        onError={(e) => { 
                          e.target.onerror = null; // Previne o buclă infinită dacă nici imaginile de rezervă nu există
                          e.target.src = isClasa1 ? "/vagon-clasa1.png" : "/vagon-clasa2.png"; 
                        }}
                      />
                      
                      {/* Info vagon (numar si clasa) suprapus peste imagine */}
                      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-neutral-700 flex flex-col items-center">
                        <span className="font-black text-lg text-yellow-400 leading-none">{vagon.numarVagon}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isClasa1 ? 'text-yellow-600' : 'text-neutral-300'}`}>
                          Clasa {vagon.clasa}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <p className="text-center text-xs font-bold text-neutral-500 uppercase tracking-widest mt-6">Apasă pe un vagon pentru detalii</p>
          </div>

          {/* Panou Detalii Vagon Selectat */}
          {selectedVagon && (
            <div className="bg-neutral-800 p-8 rounded-[3rem] shadow-2xl border-4 border-yellow-400/20 relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedVagon(null)}
                className="absolute top-6 right-6 p-2 bg-neutral-900 hover:bg-neutral-700 text-neutral-400 rounded-full transition-colors border border-neutral-700"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className={`p-6 rounded-3xl shrink-0 flex flex-col justify-center items-center w-32 h-32 text-black shadow-inner ${selectedVagon.clasa === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : 'bg-gradient-to-br from-neutral-300 to-neutral-500'}`}>
                   <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Vagon</span>
                   <span className="text-6xl font-black drop-shadow-md">{selectedVagon.numarVagon}</span>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="text-2xl font-black text-neutral-100">Detalii Vagon</h4>
                    <div className="flex gap-4 mt-2">
                      <span className={`px-3 py-1 text-sm font-bold rounded-full ${selectedVagon.clasa === 1 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'bg-neutral-700 text-neutral-300 border border-neutral-600'}`}>
                        Clasa {selectedVagon.clasa}
                      </span>
                      <span className="px-3 py-1 text-sm font-bold rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700">
                        {selectedVagon.numarLocuri} de locuri
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3">Facilități incluse</h5>
                    <div className="flex flex-wrap gap-3">
                      {selectedVagon.facilitati?.map((fac, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-xl text-sm font-bold text-neutral-300 shadow-sm">
                          <span className="text-yellow-400">{getFacilityIcon(fac)}</span>
                          {fac}
                        </div>
                      ))}
                      {(!selectedVagon.facilitati || selectedVagon.facilitati.length === 0) && (
                        <span className="text-neutral-500 italic font-medium">Nicio facilitate specială listată.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : null}

      {/* AI Assistant Chat Box */}
      <div className="bg-neutral-800/80 backdrop-blur-md p-6 md:p-8 rounded-[3rem] shadow-xl shadow-black/50 border border-neutral-700 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 border-b border-neutral-700 pb-4">
          <div className="bg-yellow-400/10 p-3 rounded-2xl border border-yellow-400/20">
            <MessageSquare className="text-yellow-400" size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black text-neutral-100">Asistent AI Compoziție</h4>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">AI Agent Platforma Management Feroviar</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col">
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-2xl font-semibold text-sm leading-relaxed shadow-sm
                  ${msg.sender === 'user' 
                    ? 'bg-yellow-500 text-black rounded-br-none' 
                    : 'bg-neutral-900 text-neutral-200 rounded-bl-none border border-neutral-700'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start items-center gap-2 text-neutral-500 text-sm font-bold pl-2 animate-pulse">
              <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              Asistentul scrie...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Întreabă AI-ul despre trenuri (ex: Care trenuri au aer condiționat?)"
            className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl font-semibold outline-none focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all text-neutral-200 placeholder:text-neutral-500 text-sm"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !chatInput.trim()}
            className="px-5 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 disabled:text-neutral-400 text-black font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer border-0"
          >
            <Send size={16} />
            Trimite
          </button>
        </form>
      </div>

    </div>
  );
};

export default WagonWeb;