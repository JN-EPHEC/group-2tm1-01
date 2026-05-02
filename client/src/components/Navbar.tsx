
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Kiné-Web</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
