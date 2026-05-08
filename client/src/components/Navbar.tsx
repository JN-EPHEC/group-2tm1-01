import { Link, NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

interface NavbarProps {
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, isAuthenticated }) => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand custom-navbar-brand d-flex align-items-center" to="/">
          <div 
            className="me-2 rounded-circle overflow-hidden bg-white d-flex justify-content-center align-items-center navbar-logo-container"
          >
            <img 
              src="/img/logo.png" 
              alt="Logo" 
              className="navbar-logo-img"
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
                </ul>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Connexion</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Inscription</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link fw-bold text-primary" to="/profil">
                  <i className="bi bi-person-circle me-1"></i>
                  Mon Profil
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
