import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div>
      {/* Section Héro */}
      <div className="rounded-3 hero-section">
        <div className="container-fluid hero-content">
          <h1 className="hero-title">Bienvenue chez votre kinésithérapeute</h1>
          <p className="col-md-8 hero-subtitle">
            "Prenez soin de vous en toute liberté. De la prise de rendez-vous en ligne au suivi personnalisé de votre rééducation, 
            accédez à tout notre univers en un instant."
          </p>
          <div className="hero-buttons">
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
            "Spécialiste de la kinésithérapie globale et de la thérapie manuelle, je mets mon expertise au service de votre santé. Mon approche repose sur 
            un diagnostic précis et un accompagnement personnalisé, visant à restaurer votre mobilité et à soulager vos douleurs durablement. Chaque séance 
            est conçue pour répondre à vos besoins spécifiques, dans un cadre bienveillant et moderne."
          </p>
        </div>
      </div>

      {/* Section Infos Pratiques */}
      <div className="row g-4 mb-5">
        {/* Horaires */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body">
              <h3 className="card-title h5 text-primary mb-3">Horaires d'ouverture</h3>
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
              <h3 className="card-title h5 text-primary mb-3">Contact</h3>
              <div className="mt-3 text-muted">
                <p className="mb-2"><strong>Téléphone :</strong> <br/> [XXXX XX XX XX]</p>
                <p className="mb-2"><strong>Email :</strong> <br/> [votre.email@kine.be]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carte / Adresse */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body d-flex flex-column">
              <h3 className="card-title h5 text-primary mb-3">Plan d'accès</h3>
              <p className="mb-2 text-muted fw-bold">[adresse]</p>
              <div className="bg-light text-muted d-flex align-items-center justify-content-center flex-grow-1 rounded border map-placeholder">
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