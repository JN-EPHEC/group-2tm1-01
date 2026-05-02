import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Section Héro */}
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Bienvenue chez votre kinésithérapeute</h1>
          <p className="col-md-8 fs-4 mt-3">
            Prenez rendez-vous en ligne, consultez nos produits de soin et gérez votre suivi de rééducation en toute simplicité.
          </p>
          <div className="mt-4">
            <Link to="/client/rendez-vous" className="btn btn-primary btn-lg me-3">Prendre rendez-vous</Link>
            <Link to="/client/produits" className="btn btn-outline-primary btn-lg">Voir la boutique</Link>
          </div>
        </div>
      </div>

      {/* Section Explications */}
      <div className="row mb-5 mt-5">
        <div className="col-12 text-center mb-4">
          <h2>À propos du cabinet</h2>
        </div>
        <div className="col-md-8 offset-md-2 text-center text-muted">
          <p className="lead">
            [Zone d'explication : Remplissez ici avec votre présentation. Par exemple : Spécialiste en kinésithérapie globale et thérapie manuelle, je vous accompagne dans votre rééducation...]
          </p>
        </div>
      </div>

      {/* Section Infos Pratiques */}
      <div className="row g-4 mb-5">
        {/* Horaires */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body">
              <h3 className="card-title h5 text-primary mb-3">🕒 Horaires d'ouverture</h3>
              <ul className="list-unstyled mt-3 text-muted">
                <li className="d-flex justify-content-between mb-2"><strong>Lundi :</strong> <span>[08:00 - 18:00]</span></li>
                <li className="d-flex justify-content-between mb-2"><strong>Mardi :</strong> <span>[08:00 - 18:00]</span></li>
                <li className="d-flex justify-content-between mb-2"><strong>Mercredi :</strong> <span>[08:00 - 12:00]</span></li>
                <li className="d-flex justify-content-between mb-2"><strong>Jeudi :</strong> <span>[08:00 - 19:00]</span></li>
                <li className="d-flex justify-content-between mb-2"><strong>Vendredi :</strong> <span>[08:00 - 17:00]</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body">
              <h3 className="card-title h5 text-primary mb-3">📞 Contact</h3>
              <div className="mt-3 text-muted">
                <p className="mb-2"><strong>Téléphone :</strong> <br/> [04XX XX XX XX]</p>
                <p className="mb-2"><strong>Email :</strong> <br/> [votre.email@kine.be]</p>
                <p className="mb-2"><strong>Urgences :</strong> <br/> [Texte pour les urgences]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carte / Adresse */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body d-flex flex-column">
              <h3 className="card-title h5 text-primary mb-3">📍 Plan d'accès</h3>
              <p className="mb-2 text-muted fw-bold">[Votre adresse complète ici]</p>
              <p className="mb-2 text-muted small">[Instructions: 2ème étage, parking dispo, etc.]</p>
              <div className="bg-light text-muted d-flex align-items-center justify-content-center flex-grow-1 rounded border" style={{ minHeight: '150px' }}>
                [Zone d'intégration carte Google Maps]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;