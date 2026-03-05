import { useState, useEffect, useRef } from 'react';
import { Download, Link as LinkIcon, Music, Film, Loader2, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { Preview } from '../components/Preview';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import axios from 'axios';

export function Home() {
  const { user } = useAuth();
  const [link, setLink] = useState('');
  const [format, setFormat] = useState('audio');
  const [quality, setQuality] = useState('320kbps');
  const [isSearching, setIsSearching] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  
  const [taskId, setTaskId] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioQualities = ['320kbps', '192kbps', '128kbps'];
  const videoQualities = ['4K', '1080p', '720p', '480p'];
  const currentQualities = format === 'audio' ? audioQualities : videoQualities;
  const intervalRef = useRef(null);

  // 🌍 URL da API: Tenta usar o Render (na nuvem) ou Localhost (no seu PC)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (format === 'audio') setQuality('320kbps');
    else setQuality('1080p');
  }, [format]);

  // Busca de informações do vídeo (Preview)
  useEffect(() => {
    if (link.includes('youtube') || link.includes('youtu.be')) {
      setIsSearching(true);
      setPreviewData(null);
      const timer = setTimeout(async () => {
        try {
          // 🛡️ encodeURIComponent evita o erro 400 protegendo o link
          const response = await axios.get(`${apiUrl}/api/info?url=${encodeURIComponent(link)}`);
          setPreviewData({
            title: response.data.title,
            artist: response.data.artist || 'Desconhecido',
            thumbnail: response.data.thumbnail,
            duration: response.data.duration
          });
        } catch (error) {
          console.error("Erro ao buscar informações do vídeo:", error);
        } finally {
          setIsSearching(false);
        }
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setPreviewData(null);
      setIsSearching(false);
    }
  }, [link, apiUrl]);

  const handleDownload = async () => {
    try {
      // Inicia o processo de download no servidor Render
      const res = await axios.post(`${apiUrl}/api/download/start`, {
        url: link, 
        format_type: format, 
        quality: quality
      });
      
      setTaskId(res.data.task_id);
      setProgressData({ status: 'starting', percent: '0%' });
      
      // Salva a tentativa no seu histórico do Firebase
      if (user && previewData) {
        await addDoc(collection(db, "downloads"), {
          userId: user.uid, 
          title: previewData.title, 
          artist: previewData.artist,
          thumbnail: previewData.thumbnail, 
          type: format, 
          quality: quality,
          originalLink: link, 
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Erro ao iniciar download:", error);
      alert("Não foi possível iniciar o download. Verifique sua conexão.");
    }
  };

  // Monitora o progresso do download a cada segundo
  useEffect(() => {
    if (taskId) {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${apiUrl}/api/download/progress/${taskId}`);
          setProgressData(res.data);
          
          if (res.data.status === 'done') {
            clearInterval(intervalRef.current);
            // Redireciona para o link final que entrega o arquivo pro usuário
            window.location.href = `${apiUrl}/api/download/file/${taskId}`;
            
            setTimeout(() => {
              setTaskId(null); 
              setProgressData(null); 
              setLink(''); 
              setPreviewData(null);
            }, 3000);
          } else if (res.data.status === 'error') {
            clearInterval(intervalRef.current);
            alert("Erro no servidor ao processar o vídeo."); 
            setTaskId(null);
          }
        } catch (error) {
          console.error("Erro ao checar progresso");
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [taskId, apiUrl]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-3xl mx-auto text-center pb-24 md:pb-32 pt-12 relative">
      
      {/* Barra de Progresso Flutuante */}
      {progressData && (
        <div className="fixed md:top-8 bottom-20 md:bottom-auto left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-50 animate-in slide-in-from-bottom-4 md:slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800 text-sm">
              {progressData.status === 'processing' ? 'Finalizando arquivo...' : 'Baixando...'}
            </span>
            <span className="text-blue-600 font-bold text-sm">{progressData.percent || '0%'}</span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: progressData.percent === '100%' ? '100%' : (progressData.percent || '0%') }}></div>
          </div>

          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-center w-full gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 pt-2">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
          </button>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
              <div><p className="font-medium text-slate-400">Tamanho</p><p className="font-bold text-slate-700">{progressData.size || '--'}</p></div>
              <div><p className="font-medium text-slate-400">Velocidade</p><p className="font-bold text-slate-700">{progressData.speed || '--'}</p></div>
              <div><p className="font-medium text-slate-400">Restante</p><p className="font-bold text-slate-700">{progressData.eta || '--'}</p></div>
            </div>
          )}
        </div>
      )}

      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6">
        Baixe sem <span className="text-blue-600">complicação.</span>
      </h2>
      <p className="text-base md:text-lg text-slate-500 mb-8 md:mb-12 max-w-xl text-balance">
        Cole o link abaixo. O sistema extrai áudio ou vídeo na melhor qualidade, trazendo capa e artista automaticamente.
      </p>

      {/* Input de link e botão de ação */}
      <div className="w-full relative group flex flex-col md:block">
        <div className="absolute top-0 md:inset-y-0 left-6 flex items-center h-[60px] md:h-auto pointer-events-none">
          {isSearching ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> : <LinkIcon className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
        </div>
        
        <input
          type="text"
          placeholder="Cole o link do vídeo aqui..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          disabled={!!taskId}
          className="w-full py-5 pl-14 pr-6 md:pr-40 bg-white border border-slate-200 rounded-2xl md:rounded-full text-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:opacity-50"
        />
        
        <button 
          disabled={!previewData || !!taskId}
          onClick={handleDownload}
          className="w-full md:w-auto mt-3 md:mt-0 md:absolute md:right-2 md:top-2 md:bottom-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white py-4 md:py-0 md:px-8 rounded-2xl md:rounded-full font-medium flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg md:shadow-none"
        >
          {!!taskId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Baixar
        </button>
      </div>

      {/* Seleção de formato e qualidade */}
      <div className="flex flex-col items-center mt-8">
        <div className="flex items-center gap-4 md:gap-8 overflow-x-auto w-full justify-center pb-2">
          <button onClick={() => setFormat('audio')} className={`flex items-center gap-2 pb-2 border-b-2 transition-all whitespace-nowrap ${format === 'audio' ? 'border-slate-900 text-slate-900 font-medium' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <Music className="w-4 h-4" /> Somente Áudio
          </button>
          <button onClick={() => setFormat('video')} className={`flex items-center gap-2 pb-2 border-b-2 transition-all whitespace-nowrap ${format === 'video' ? 'border-slate-900 text-slate-900 font-medium' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <Film className="w-4 h-4" /> Vídeo Completo
          </button>
        </div>

        {previewData && (
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-1.5 w-full justify-center md:w-auto mb-2 md:mb-0">
              <Settings2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-500">Qualidade:</span>
            </div>
            <div className="flex flex-wrap justify-center bg-slate-100 p-1 rounded-2xl md:rounded-full shadow-inner">
              {currentQualities.map((q) => (
                <button key={q} onClick={() => setQuality(q)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${quality === q ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Preview data={previewData} />
    </main>
  );
}