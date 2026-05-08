﻿import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (res.ok) {
      alert("Connexion réussie");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card">
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
