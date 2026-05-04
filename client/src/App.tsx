import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminRevenuePage from './pages/admin/RevenuePage';
import AdminExpensePage from './pages/admin/ExpensePage';
import AdminProductPage from './pages/admin/ProductPage';
import ClientAppointmentPage from './pages/client/AppointmentPage';
import ClientProductPage from './pages/client/ProductPage';
import ClientCartPage from './pages/client/CartPage';
import './styles/App.css';

function App() {
  // Pour la démo, on simule si l'utilisateur est un admin ou non.
  // Dans une vraie application, cela viendrait de votre système d'authentification.
  const [isAdmin] = useState(true); 

  return (
    <Router basename="/dev3">
      <Navbar isAdmin={isAdmin} />
      <main className="container-fluid px-4 mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/revenus" element={<AdminRevenuePage />} />
          <Route path="/admin/depenses" element={<AdminExpensePage />} />
          <Route path="/admin/produits" element={<AdminProductPage />} />
          <Route path="/client/rendez-vous" element={<ClientAppointmentPage />} />
          <Route path="/client/produits" element={<ClientProductPage />} />
          <Route path="/client/panier" element={<ClientCartPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;