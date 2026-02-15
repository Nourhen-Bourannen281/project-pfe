// DeleteUserPage.jsx
import React, { useEffect, useState } from "react";
import "../styles/DeleteUser.css";

const DeleteUserPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Erreur fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        alert("Utilisateur supprimé !");
      } else {
        alert("Erreur suppression");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchName = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchName && matchRole;
  });

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        <h1>Supprimer Utilisateur</h1>
        <div className="wrapper" onClick={() => window.history.back()}>
          <svg width="18px" height="17px" viewBox="0 0 18 17" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(8.5, 8.5) scale(-1, 1) translate(-8.5, -8.5)">
              <polygon className="arrow" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
              <polygon className="arrow-fixed" points="16.37 8.34 7.76 15.30 6.90 14.31 14.29 8.34 6.90 2.42 7.76 1.43"></polygon>
              <path d="M0,0.56 L0,16.19 L9.70,8.34 L0,0.56 Z M1.33,3.30 L7.62,8.34 L1.33,13.43 L1.33,3.30 Z"></path>
            </g>
          </svg>
        </div>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        {/* Filtre par rôle */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="role-filter"
        >
          <option value="">Tous les rôles</option>
          <option value="ingénieur">Ingénieur</option>
          <option value="commercial">Commercial</option>
          <option value="responsable_stock">Responsable Stock</option>
          <option value="directeur">Directeur</option>
        </select>

        {/* Tableau des utilisateurs */}
        <table className="product-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date de création</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    id="delete"
                    className="del-btn"
                    type="button"
                    onClick={() => handleDelete(user._id)}
                  >
                    <svg
                      className="del-btn__icon"
                      viewBox="0 0 48 48"
                      width="24px"
                      height="24px"
                      aria-hidden="true"
                    >
                      <clipPath id="can-clip">
                        <rect
                          className="del-btn__icon-can-fill"
                          x="5"
                          y="24"
                          width="14"
                          height="11"
                        />
                      </clipPath>
                      <g
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        transform="translate(12,12)"
                      >
                        <g className="del-btn__icon-lid">
                          <polyline points="9,5 9,1 15,1 15,5" />
                          <polyline points="4,5 20,5" />
                        </g>
                        <g className="del-btn__icon-can">
                          <g strokeWidth="0">
                            <polyline id="can-fill" points="6,10 7,23 17,23 18,10" />
                            <use
                              clipPath="url(#can-clip)"
                              href="#can-fill"
                              fill="#fff"
                            />
                          </g>
                          <polyline points="6,10 7,23 17,23 18,10" />
                        </g>
                      </g>
                    </svg>
                    <span
                      className="del-btn__letters"
                      aria-hidden="true"
                      data-anim
                    >
                      <span className="del-btn__letter-box">
                        <span className="del-btn__letter">D</span>
                      </span>
                      <span className="del-btn__letter-box">
                        <span className="del-btn__letter">e</span>
                      </span>
                      <span className="del-btn__letter-box">
                        <span className="del-btn__letter">l</span>
                      </span>
                      <span className="del-btn__letter-box">
                        <span className="del-btn__letter">e</span>
                      </span>
                      <span className="del-btn__letter-box">
                        <span className="del-btn__letter">t</span>
                      </span>
                      <span className="del-btn__letter-box">
                        <span className="del-btn__letter">e</span>
                      </span>
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteUserPage;
