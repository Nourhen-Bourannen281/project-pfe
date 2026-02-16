// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Veuillez vous connecter.");
          navigate("/");
          return;
        }

        const res = await fetch(`${API_URL}/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("Session expirée.");
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        if (!res.ok) {
          throw new Error("Erreur serveur");
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur chargement produits:", error);
        alert("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  // =============================
  // Suppression produit (locale)
  // =============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Confirmer la suppression ?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erreur suppression");
      }

      // Mise à jour locale
      setProducts(products.filter((p) => (p._id || p.id) !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Impossible de supprimer.");
    }
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Gestion des produits</h1>
          <p>Liste complète des produits internes et fournisseurs</p>
        </div>
      </div>

      <div className="table-wrapper">

        {/* Flèche retour */}
        <div className="wrapper" onClick={() => navigate(-1)}>
          <svg width="18px" height="17px" viewBox="0 0 18 17">
            <g transform="translate(8.5, 8.5) scale(-1, 1) translate(-8.5, -8.5)">
              <polygon
                className="arrow"
                points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"
              ></polygon>
              <polygon
                className="arrow-fixed"
                points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"
              ></polygon>
              <path d="M0,0.56 L0,16.19 L9.70,8.34 L0,0.56 Z M1.33,3.30 L7.62,8.34 L1.33,13.43 L1.33,3.30 Z"></path>
            </g>
          </svg>
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">
                  Aucun produit trouvé.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const id = p._id || p.id;

                return (
                  <tr key={id}>
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td>{p.price} DT</td>

                    {/* Gestion intelligente du stock */}
                    <td className="quantity-cell">
                      {p.quantity < 2 ? (
                        <span className="badge out-of-stock">
                          Rupture de stock
                        </span>
                      ) : p.quantity < 5 ? (
                        <span className="badge low-stock">
                          Stock faible ({p.quantity})
                        </span>
                      ) : (
                        <span className="badge in-stock">
                          En stock ({p.quantity})
                        </span>
                      )}
                    </td>

                    <td className="actions-cell">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/update-product/${id}`)
                        }
                      >
                        Modifier
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
