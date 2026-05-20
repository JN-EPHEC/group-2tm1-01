import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import ClientAppointmentPage from './pages/client/AppointmentPage';
import ClientProductPage from './pages/client/ProductPage';
import ClientCartPage from './pages/client/CartPage';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import './styles/App.css';

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
          setIsAuthenticated(true);
          // Supposons que le rôle est renvoyé dans les données utilisateur
          if (userData.user_metadata?.role === 'admin' || userData.role === 'admin') {
            setIsAdmin(true);
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
      </main>
    </Router>
  );
}

export default App;
