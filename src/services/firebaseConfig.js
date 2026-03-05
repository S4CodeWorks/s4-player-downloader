import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA19L3XFeThWeYniXxZ3gIml4jdumYTTjU",
  authDomain: "s4-downloader-43fd5.firebaseapp.com",
  projectId: "s4-downloader-43fd5",
  storageBucket: "s4-downloader-43fd5.firebasestorage.app",
  messagingSenderId: "1062044576809",
  appId: "1:1062044576809:web:335bf50e4b8c99ec00c038",
  measurementId: "G-YNWV73F2GW"
};

// Inicializando os serviços do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Exportando para podermos usar em qualquer lugar do projeto
export { auth, provider, db };