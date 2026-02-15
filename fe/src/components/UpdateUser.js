// UpdateUser.jsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import "../styles/UpdateUser.css"; 
function UpdateUser() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setFormData({
        name: data.name || "",
        email: data.email || "",
      });
    } catch (err) {
      setUnauthorized(true);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [id]);


  if (loading) return <p>Chargement...</p>;
  if (unauthorized) return <Navigate to="/" />;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token manquant");
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

      if (!res.ok) {
        alert("Erreur mise à jour (code: " + res.status + ")");
        return;
      }

      alert("Profil mis à jour !");
    } catch (error) {
      alert("Erreur mise à jour");
    }
  };

  return (
  <div className="update-root">
    <div className="update-container">
      <h2>Modifier Profil</h2>
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
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  </div>
);

}

export default UpdateUser;
