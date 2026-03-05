import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, History as HistoryIcon, Home as HomeIcon } from 'lucide-react';

export function Navbar() {
  const { user, signInWithGoogle, logOut } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* 💻 VERSÃO DESKTOP (Invisível no Celular) */}
      <header className="hidden md:flex items-center justify-between px-8 py-6 w-full max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          S4 Player
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/historico" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                <HistoryIcon className="w-4 h-4" />
                Histórico
              </Link>

              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <div className="flex items-center gap-2">
                  <img src={user.photoURL} alt="Perfil" className="w-8 h-8 rounded-full shadow-sm" />
                  <span className="text-sm font-medium text-slate-700">
                    {user.displayName.split(' ')[0]}
                  </span>
                </div>
                <button onClick={logOut} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Sair">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <button onClick={signInWithGoogle} className="text-sm font-semibold hover:text-blue-600 transition-colors">
              Entrar com Google
            </button>
          )}
        </div>
      </header>

      {/* 📱 VERSÃO MOBILE - Cabeçalho Minimalista */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-50/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
        <Link to="/" className="text-xl font-bold tracking-tighter">S4 Player</Link>
        {user ? (
          <img src={user.photoURL} className="w-8 h-8 rounded-full shadow-sm" alt="Perfil" />
        ) : (
          <button onClick={signInWithGoogle} className="text-sm font-semibold text-blue-600">Entrar</button>
        )}
      </header>

      {/* 📱 VERSÃO MOBILE - Bottom Navigation (Barra inferior estilo App) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 flex items-center justify-around py-3 pb-safe z-50">
        <Link to="/" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-400'}`}>
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide uppercase">Início</span>
        </Link>
        
        {user && (
          <Link to="/historico" className={`flex flex-col items-center gap-1.5 ${location.pathname === '/historico' ? 'text-blue-600' : 'text-slate-400'}`}>
            <HistoryIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Histórico</span>
          </Link>
        )}
        
        {user && (
          <button onClick={logOut} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-red-500">
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Sair</span>
          </button>
        )}
      </nav>
    </>
  );
}