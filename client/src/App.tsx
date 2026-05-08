import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import ClientAppointmentPage from './pages/client/AppointmentPage';
import ClientProductPage from './pages/client/ProductPage';
import ClientCartPage from './pages/client/CartPage';
import './styles/App.css';

function App() {

  const [isAdmin] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Navbar isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
      <main className="container-fluid px-4 mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profil" element={<ProfilePage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/client/rendez-vous" element={<ClientAppointmentPage />} />
          <Route path="/client/produits" element={<ClientProductPage />} />
          <Route path="/client/panier" element={<ClientCartPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;