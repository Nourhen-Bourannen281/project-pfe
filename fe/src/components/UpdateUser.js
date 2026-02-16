// UpdateUser.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UpdateUser.css"; 

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
          setError("Non authentifié");
          setLoading(false);
          return;
        }

        // Vérifier que l'utilisateur modifie son propre profil
        if (user.id !== id) {
          setError("Vous ne pouvez modifier que votre propre profil");
          setLoading(false);
          return;
        }

        console.log("🔍 Chargement du profil:", id);
        
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur chargement");
        }

        const userData = data.data || data;
        
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (err) {
        console.error("❌ Erreur fetch:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UpdateUser.jsx - Ajoutez ces logs dans handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log("=".repeat(60));
  console.log("🔍 FORMULAIRE SOUMIS");
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  
  console.log("📌 Token présent:", !!token);
  console.log("📌 Utilisateur connecté:", user);
  console.log("📌 ID dans l'URL:", id);
  console.log("📌 Données du formulaire:", formData);
  console.log("=".repeat(60));

  if (!token) {
    alert("Token manquant");
    return;
  }

  // Vérification côté frontend
  if (user.id !== id) {
    alert(`Erreur: Vous essayez de modifier l'ID ${id} mais vous êtes connecté avec l'ID ${user.id}`);
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("📌 Réponse du serveur:", data);

    if (!res.ok) {
      throw new Error(data.message || "Erreur mise à jour");
    }

    alert("✅ Profil mis à jour !");
    navigate(-1);
  } catch (error) {
    console.error("❌ Erreur:", error);
    alert(error.message);
  }
};

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur : {error}</div>;

  return (
    <div className="update-root">
      <div className="update-container">
        <h2>Modifier mon profil</h2>
        <div className="wrapper" onClick={() => navigate(-1)}>
          <svg width="18px" height="17px" viewBox="0 0 18 17">
            <g transform="translate(8.5, 8.5) scale(-1, 1) translate(-8.5, -8.5)">
              <polygon className="arrow" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
              <polygon className="arrow-fixed" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
              <path d="M0,0.56 L0,16.19 L9.70,8.34 L0,0.56 Z M1.33,3.30 L7.62,8.34 L1.33,13.43 L1.33,3.30 Z"></path>
            </g>
          </svg>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <button type="submit">Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;