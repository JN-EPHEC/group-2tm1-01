
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center mb-4">Connexion</h1>
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Adresse Email</label>
                <input type="email" className="form-control" id="email" placeholder="nom@exemple.com" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Mot de passe</label>
                <input type="password" className="form-control" id="password" />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Se connecter</button>
              </div>
              <p className="mt-3 text-center">
                Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
