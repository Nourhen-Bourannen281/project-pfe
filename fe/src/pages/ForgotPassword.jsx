import React, { useState } from "react";
import "../styles/ForgotPassword.css"; // <-- ajoute ton fichier CSS

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="form-container">
          <h1>Mot de passe oublié</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
        <div className="circle circle-one"></div>
        <div className="circle circle-two"></div>
      </div>
    </div>
  );
}

export default ForgotPassword;
