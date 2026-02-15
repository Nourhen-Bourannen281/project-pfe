import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const DashboardDirecteur = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // récupère l'utilisateur connecté

  const handleUpdateProfile = () => {
    if (!user || !user.id) {
      alert("Utilisateur non connecté ou ID manquant");
      return;
    }
    navigate(`/update-user/${user.id}`);
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        <h1>Bienvenue Directeur 👋</h1>
        <h2>Tableau de bord</h2>

        {/* Actions principales */}
        <div className="dashboard-actions">
          <button onClick={() => navigate("/register")}>
            Ajouter un utilisateur
          </button>
          <button onClick={() => navigate("/products")}>
            Gérer les produits
          </button>
          <button onClick={() => navigate("/delete-user")}>
            Supprimer utilisateur
          </button>
          <button onClick={handleUpdateProfile}>
            👤 Modifier mon profil
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardDirecteur;
