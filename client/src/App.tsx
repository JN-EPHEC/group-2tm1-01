import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import './styles/App.css';

// Code Splitting (Lazy Loading) - Évite de charger toutes les pages au démarrage
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminAppointmentsPage = lazy(() => import('./pages/admin/AdminAppointmentsPage'));
const ClientAppointmentPage = lazy(() => import('./pages/client/AppointmentPage'));
const ClientProductPage = lazy(() => import('./pages/client/ProductPage'));
const ClientCartPage = lazy(() => import('./pages/client/CartPage'));

function App() {

  const [isAdmin, setIsAdmin] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérification de la session au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://m1-4.ephec-ti.be:5173/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          
          if (userData.isAuthenticated === false) {
            setIsAuthenticated(false);
            setIsAdmin(false);
          } else {
            setIsAuthenticated(true);
            // Supposons que le rôle est renvoyé dans les données utilisateur
            if (userData.user_metadata?.role === 'admin' || userData.role === 'admin') {
              setIsAdmin(true);
            }
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erreur de vérification de session', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Handler de déconnexion pour ProfilePage ou Navbar s'ils l'appelaient
  // La mise à jour d'état depuis LoginPage/ProfilePage devrait aussi ajuster isAdmin,
  // ou l'on peut refaire un appel si l'état local ne suffit pas, mais une propagation via props est souvent utile.

  return (
    <Router>
      <Navbar isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
      <main className="container-fluid px-4 mt-4">
        <Suspense fallback={<div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Chargement...</span></div></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
            <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/admin" element={<AdminRoute isAuthenticated={isAuthenticated} loading={loading} isAdmin={isAdmin}><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/produits" element={<AdminRoute isAuthenticated={isAuthenticated} loading={loading} isAdmin={isAdmin}><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/commandes" element={<AdminRoute isAuthenticated={isAuthenticated} loading={loading} isAdmin={isAdmin}><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/rendez-vous" element={<AdminRoute isAuthenticated={isAuthenticated} loading={loading} isAdmin={isAdmin}><AdminAppointmentsPage /></AdminRoute>} />
            <Route path="/client/rendez-vous" element={<ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}><ClientAppointmentPage isAuthenticated={isAuthenticated} /></ProtectedRoute>} />
            <Route path="/client/produits" element={<ClientProductPage />} />
            <Route path="/client/panier" element={<ClientCartPage />} />
            
            {/* Ta route de profil, bien à sa place avec le bon chemin de ton projet */}
            <Route path="/profil" element={<ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}><ProfilePage setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
