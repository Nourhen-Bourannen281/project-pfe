// Login.jsx
import React, { useState } from "react";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Données utilisateur reçues:", data);

      if (data.success) {
        if (remember) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirection selon le rôle
        if (data.user.role === "ingénieur") {
          window.location.href = "/engineer-dashboard";
        } else if (data.user.role === "responsable_stock") {
          window.location.href = "/stock-dashboard";
        } else if (data.user.role === "directeur") {
          window.location.href = "/dashboard-directeur";
        } else {
          alert("Accès refusé : rôle non autorisé");
          localStorage.clear();
        }
      } else {
        alert(data.message || "Échec de la connexion");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      alert("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container">
      <div className="login-container">
        <div className="circle circle-one"></div>
        <div className="circle circle-two"></div>

        <div className="form-container">
          <img
            src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
            alt="illustration"
            className="illustration"
          />

          <h1 className="opacity">Connexion</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button className="opacity" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="register-forget">
            <label className="opacity">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              Se souvenir de moi
            </label>
            <a href="/forgot-password" className="opacity">
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </div>
      <div className="theme-btn-container"></div>
    </section>
  );
}

export default Login;
