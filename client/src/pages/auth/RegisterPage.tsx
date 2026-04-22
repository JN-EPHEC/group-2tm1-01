import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center mb-4">Inscription</h1>
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Adresse Email</label>
                <input type="email" className="form-control" id="email" placeholder="nom@exemple.com" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Mot de passe</label>
                <input type="password" className="form-control" id="password" />
              </div>
               <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
                <input type="password" className="form-control" id="confirmPassword" />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">S'inscrire</button>
              </div>
              <p className="mt-3 text-center">
                Déjà un compte ? <Link to="/login">Connectez-vous</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;