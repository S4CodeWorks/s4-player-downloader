import { CheckCircle2, Clock } from 'lucide-react';

export function Preview({ data }) {
  if (!data) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Thumbnail com proporção de vídeo e bordas suaves */}
      <div className="relative shrink-0">
        <img 
          src={data.thumbnail} 
          alt="Capa do vídeo" 
          className="w-48 sm:w-56 aspect-video object-cover rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        />
        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {data.duration}
        </div>
      </div>

      {/* Informações flutuantes */}
      <div className="flex-1 flex flex-col justify-center sm:pt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
            Pronto para baixar
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
          {data.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {data.artist}
        </p>
      </div>
    </div>
  );
}