import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export function ErrorPage() {
  // Esse hook do React Router pega qual foi o erro exato que o site deu
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-900 selection:bg-blue-200 animate-in fade-in duration-500">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
      
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
        Opa! Algo deu errado.
      </h1>
      
      <p className="text-lg text-slate-500 mb-8 max-w-md">
        Desculpe, encontramos um erro inesperado no sistema. Mas não se preocupe, você pode voltar para a página inicial.
      </p>
      
      {/* Mostra o erro técnico de forma sutil (bom para você debugar) */}
      <div className="bg-slate-200/50 p-4 rounded-2xl text-xs text-slate-500 font-mono mb-10 max-w-lg w-full overflow-auto text-left">
        <i>{error?.statusText || error?.message || "Erro desconhecido"}</i>
      </div>

      <Link 
        to="/" 
        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 transition-all active:scale-95"
      >
        <Home className="w-4 h-4" />
        Voltar para o Início
      </Link>
    </div>
  );
}