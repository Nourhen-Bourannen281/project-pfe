import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StockManagerDashboard.css";

function StockManagerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "responsable_stock") {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    const handleUpdateProfile = () => {
  // Récupérer l'utilisateur du localStorage
  const userStr = localStorage.getItem("user");
  console.log("📌 userStr brut:", userStr);
  
  try {
    const user = JSON.parse(userStr);
    console.log("📌 user parsé:", user);
    console.log("📌 user.id:", user.id);
    console.log("📌 Type de user.id:", typeof user.id);
    
    if (!user || !user.id) {
      alert("Utilisateur non connecté ou ID manquant");
      console.error("❌ ID manquant dans user:", user);
      return;
    }
    
    // Nettoyer l'ID (enlever les espaces éventuels)
    const cleanId = user.id.trim();
    console.log("📌 ID nettoyé:", cleanId);
    
    // Tester l'URL complète
    const url = `/update-user/${cleanId}`;
    console.log("📌 Navigation vers:", url);
    
    navigate(url);
  } catch (error) {
    console.error("❌ Erreur parsing user:", error);
    alert("Erreur de lecture des données utilisateur");
  }
};

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Produits reçus:", res.data);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Erreur chargement produits", err);
        if (err.response?.status === 403) {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  if (loading) return <p className="loading-text">Chargement...</p>;
  if (unauthorized) return <Navigate to="/unauthorized" />;

  const handleUpdateProfile = () => {
    if (!user || !user.id) {
      alert("Utilisateur non connecté ou ID manquant");
      return;
    }
    console.log("Redirection vers update-user avec ID:", user.id);
    navigate(`/update-user/${user.id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (!id) {
      alert("ID produit manquant !");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
      alert("Produit supprimé !");
    } catch (err) {
      console.error("Erreur suppression produit", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleEditProduct = (id) => {
    if (!id) {
      alert("ID produit manquant !");
      return;
    }
    navigate(`/update-product/${id}`);
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        <h1>📦 Gestion des Stocks 📦</h1>

        <div className="dashboard-actions">
          <button onClick={() => navigate("/add-product")}>➕ Ajouter un produit</button>
         {/* */} <button onClick={handleUpdateProfile}>👤 Modifier mon profil</button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            🚪 Déconnexion
          </button>
        </div>

        <h2>Liste des produits</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Quantité</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id || p._id}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.quantity}</td>
                  <td>{p.price} DT</td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(p.id || p._id)}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="del-btn"
                      onClick={() => handleDeleteProduct(p.id || p._id)}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Aucun produit trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockManagerDashboard;