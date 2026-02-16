// EngineerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EngineerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des produits", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdateProfile = () => {
    if (!user) {
      alert("Utilisateur non connecté");
      return;
    }
    navigate(`/update-user/${user.id}`);
  };

  if (loading) return <p className="loading-text">Chargement...</p>;

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        <h1>Dashboard Ingénieur</h1>
        <h2>Liste des produits</h2>

        <table className="product-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.price} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="dashboard-actions" style={{ marginTop: "20px" }}>
          <button onClick={handleUpdateProfile} style={{ marginRight: "10px" }}>
            Modifier mon profil
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default EngineerDashboard;
