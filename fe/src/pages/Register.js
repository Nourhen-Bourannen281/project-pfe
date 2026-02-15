// RegisterPage.jsx
import React, { useState } from "react";
import "../styles/Auth.css";
import BackButton from "../components/BackButton";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Utilisateur créé avec succès !");
        setFormData({ name: "", email: "", role: "", password: "" });
      } else {
        alert(data.message || "Erreur lors de la création");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur serveur");
    }
  };

  return (
    <section className="container">
      <div className="login-container">
        {/* Bouton flèche en haut */}
        <div className="wrapper" onClick={() => window.history.back()}>
          <svg width="18px" height="17px" viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(8.5, 8.5) scale(-1, 1) translate(-8.5, -8.5)">
              <polygon className="arrow" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
              <polygon className="arrow-fixed" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
              <path d="M0,0.56 L0,16.19 L9.70,8.34 L0,0.56 Z M1.33,3.30 L7.62,8.34 L1.33,13.43 L1.33,3.30 Z"></path>
            </g>
          </svg>
        </div>

        <div className="form-container">
          <h1 className="opacity">Créer un compte</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Choisir un rôle</option>
              <option value="ingénieur">Ingénieur</option>
              <option value="commercial">Commercial</option>
              <option value="responsable_stock">Responsable Stock</option>
              <option value="directeur">Directeur</option>
            </select>
            <button type="submit">Créer</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
