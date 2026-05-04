
import { Link, NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand custom-navbar-brand d-flex align-items-center" to="/">
          <div 
            className="me-2 rounded-circle overflow-hidden bg-white d-flex justify-content-center align-items-center"
            style={{ width: '70px', height: '70px', flexShrink: 0 }}
          >
            <img 
              src="/dev3/img/logo.png" 
              alt="Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.4)' }} 
            />
          </div>
          Kiné-Web
        </Link>
        <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Accueil</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/client/rendez-vous">Prendre rendez-vous</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/client/produits">Nos produits</NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Admin
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><NavLink className="dropdown-item" to="/admin">Dashboard</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/revenus">Revenus</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/depenses">Dépenses</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/admin/produits">Gérer les Produits</NavLink></li>
                </ul>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
             <li className="nav-item">
              <NavLink className="nav-link" to="/login">Connexion</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">Inscription</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
