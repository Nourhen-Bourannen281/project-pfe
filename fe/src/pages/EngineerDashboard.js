import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import "../styles/EngineerDashboard.css";

function EngineerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des produits', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Vérification du rôle
  if (!user || user.role !== 'ingénieur') {
    return <Navigate to="/unauthorized" />;
  }

  if (loading) return <p className="loading-text">Chargement...</p>;

  return (
    <div className="dashboard-root">
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
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dashboard-actions">
        <button onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}>
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default EngineerDashboard;
