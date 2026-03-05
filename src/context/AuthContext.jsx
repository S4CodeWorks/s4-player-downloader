import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../services/firebaseConfig';

// Cria o contexto
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Evita piscar a tela antes do Firebase responder

  // Chama o Pop-up do Google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login com Google: ", error);
    }
  };

  // Desloga o usuário
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair: ", error);
    }
  };

  // Fica escutando se o usuário logou ou deslogou em tempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Firebase já respondeu, pode renderizar a tela
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso nos outros arquivos
export function useAuth() {
  return useContext(AuthContext);
}