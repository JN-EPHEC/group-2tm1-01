import { Link, useNavigate } from 'react-router-dom';

interface RegisterPageProps {
  setIsAuthenticated: (val: boolean) => void;
}

const RegisterPage = ({ setIsAuthenticated }: RegisterPageProps) => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    navigate('/profil');
  };

  return (
    <div className="row justify-content-center mt-5 mb-5">
      <div className="col-md-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="card-title text-center text-primary mb-4">Créer un compte</h2>
            <form onSubmit={handleRegister}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">Prénom</label>
                  <input type="text" className="form-control" id="firstName" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">Nom</label>
                  <input type="text" className="form-control" id="lastName" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Adresse Email</label>
                  <input type="email" className="form-control" id="email" placeholder="nom@exemple.com" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">Téléphone</label>
                  <input type="tel" className="form-control" id="phone" required />
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label">Adresse complète</label>
                  <input type="text" className="form-control" id="address" placeholder="Rue, Numéro, Boîte, Code Postal, Ville" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input type="password" className="form-control" id="password" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
                  <input type="password" className="form-control" id="confirmPassword" required />
                </div>
              </div>
              
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg">S'inscrire</button>
              </div>
              <p className="mt-4 text-center">
                Déjà un compte ? <Link to="/login" className="text-decoration-none fw-bold">Connectez-vous</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
