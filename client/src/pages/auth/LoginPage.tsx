﻿import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginPageProps {
  setIsAuthenticated: (val: boolean) => void;
  setIsAdmin: (val: boolean) => void;
}

const LoginPage = ({ setIsAuthenticated, setIsAdmin }: LoginPageProps) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement brut de la page vers l'API

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important pour les sessions / cookies
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        setIsAuthenticated(true);
        if (data.user?.user_metadata?.role === 'admin' || data.user?.role === 'admin' || data.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        navigate("/profil"); 
      } else {
        alert(data.error || "Identifiants incorrects");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      alert("Impossible de joindre le serveur.");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h1 className="card-title text-center mb-4">Connexion</h1>

            <form onSubmit={handleLogin}>
              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label">Adresse Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* BUTTON */}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Se connecter
                </button>
              </div>

              <p className="mt-3 text-center">
                Pas encore de compte ?{" "}
                <Link to="/register">Inscrivez-vous</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;