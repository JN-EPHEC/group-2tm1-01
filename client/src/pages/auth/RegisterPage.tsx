import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterPageProps {
  setIsAuthenticated: (val: boolean) => void;
}

const RegisterPage = ({ setIsAuthenticated }: RegisterPageProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setError("Erreur : Le mot de passe de confirmation est différent du mot de passe saisi.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_]).{8,20}$/;
    if (!passwordRegex.test(data.password as string)) {
      setError("Erreur : Votre mot de passe ne respecte pas les restrictions de sécurité.");
      return;
    }

    try {
      const res = await fetch('https://m1-4.ephec-ti.be:5173/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          password: data.password
        })
      });

      if (res.ok) {
        setIsAuthenticated(true);
        navigate('/profil');
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="row justify-content-center mt-5 mb-5">
      <div className="col-md-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="card-title text-center text-primary mb-4">Créer un compte</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleRegister}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">Prénom</label>
                  <input type="text" className="form-control" name="firstName" id="firstName" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">Nom</label>
                  <input type="text" className="form-control" name="lastName" id="lastName" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Adresse Email</label>
                  <input type="email" className="form-control" name="email" id="email" placeholder="nom@exemple.com" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">Téléphone</label>
                  <input type="tel" className="form-control" name="phone" id="phone" required />
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label">Adresse complète</label>
                  <input type="text" className="form-control" name="address" id="address" placeholder="Rue, Numéro, Boîte, Code Postal, Ville" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input type="password" className="form-control" name="password" id="password" required />
                  <div className="form-text">
                    8 à 20 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
                  <input type="password" className="form-control" name="confirmPassword" id="confirmPassword" required />
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
