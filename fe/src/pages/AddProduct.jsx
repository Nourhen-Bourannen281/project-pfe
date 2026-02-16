// AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddProduct.css";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert("✅ Produit ajouté avec succès !");
        navigate("/stock-dashboard"); // redirection vers dashboard
      } else {
        alert("Erreur lors de l'ajout du produit");
      }
    } catch (err) {
      console.error("Erreur ajout produit:", err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="add-root">
      <div className="add-container">
        <h2>➕ Ajouter un produit</h2>
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nom du produit"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Prix (€)"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantité"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
