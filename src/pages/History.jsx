import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Music, Film, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export function History() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) return <Navigate to="/" />;

  useEffect(() => {
    const q = query(collection(db, "downloads"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setDownloads(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    try { await deleteDoc(doc(db, "downloads", id)); } 
    catch (error) { console.error("Erro ao deletar: ", error); }
  };

  return (
    // pb-24 adicionado para o celular não cortar o final da lista
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-24 md:pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Seu Histórico</h2>
          <p className="text-sm md:text-base text-slate-500">Downloads salvos em nuvem.</p>
        </div>
        <span className="text-xs md:text-sm font-medium bg-slate-100 px-3 md:px-4 py-1.5 rounded-full text-slate-600">
          {downloads.length} {downloads.length === 1 ? 'arquivo' : 'arquivos'}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-20 text-slate-400"><p>Você ainda não baixou nada.</p></div>
      ) : (
        <div className="space-y-3 md:space-y-1">
          {downloads.map((item) => (
            <div key={item.id} className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 rounded-3xl bg-white md:bg-transparent hover:bg-white shadow-sm md:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all border border-slate-100 md:border-transparent hover:border-slate-100">
              <div className="flex items-center gap-4">
                <img src={item.thumbnail} className="w-16 h-16 rounded-2xl object-cover" alt="Capa" />
                <div className="flex-1 min-w-0 md:hidden">
                  <h4 className="font-bold text-slate-800 truncate text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{item.artist}</p>
                </div>
              </div>
              
              <div className="hidden md:block flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    {item.type === 'audio' ? <Music className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                    {item.type === 'audio' ? 'Áudio' : 'Vídeo'}
                  </span>
                  <span>•</span><span>{item.quality}</span><span>•</span><span className="truncate">{item.artist}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity pt-2 md:pt-0 border-t border-slate-50 md:border-none mt-2 md:mt-0">
                <div className="flex md:hidden items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {item.type === 'audio' ? <Music className="w-3 h-3" /> : <Film className="w-3 h-3" />} {item.quality}
                </div>
                <div className="flex gap-2">
                  <a href={item.originalLink} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 md:bg-transparent rounded-full" title="Abrir link original">
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-red-50 md:bg-transparent rounded-full" title="Remover do histórico">
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}