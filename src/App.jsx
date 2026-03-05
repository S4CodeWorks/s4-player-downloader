import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { ErrorPage } from './pages/ErrorPage'; // Importando a tela de erro
import { AuthProvider } from './context/AuthContext';

function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col selection:bg-blue-200">
        <Navbar />
        <Outlet />
      </div>
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />, // Se der erro em QUALQUER lugar, cai aqui!
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/historico",
        element: <History />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;