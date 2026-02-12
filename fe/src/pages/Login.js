import React, { useState } from "react";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      // Stocker le token et le rôle
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Redirection selon rôle
      if (data.user.role === "ingénieur") {
        window.location.href = "/engineer-dashboard";
      } else if (data.user.role === "responsable_stock") {
        window.location.href = "/stock-dashboard";
      } else {
        alert("Accès refusé : rôle non autorisé");
      }
    } else {
      alert(data.message || "Échec de la connexion");
    }
  } catch (err) {
    console.error("Erreur de connexion:", err);
    alert("Erreur serveur");
  }
};


  return (
    <div className="login-root">
      {/* Fond avec grille animée */}
      <div className="loginbackground box-background--white">
        <div className="loginbackground-gridContainer">
          {/* Ligne 1 - Carrés bleus */}
          <div className="box-root flex-flex" style={{ gridArea: 'top / start / top / end' }}>
            <div className="box-root" style={{ gridArea: 'top / start / top / end' }}>
              <div className="box-root flex-flex flex-direction--column" style={{ height: '100%' }}>
                <div className="box-root tans3s animationLeftRight">
                  <div className="box-root flex-flex flex-direction--column">
                    <div className="box-root flex-flex">
                      <div className="box-root" style={{ borderColor: '#5469d4', width: '86.6px', height: '64px' }}>
                        <div className="box-root box-background--blue800" style={{ width: '100%', height: '100%', opacity: 0.4 }}></div>
                      </div>
                      <div className="box-root" style={{ borderColor: '#5469d4', width: '86.6px', height: '64px' }}>
                        <div className="box-root box-background--blue" style={{ width: '100%', height: '100%', opacity: 0.6 }}></div>
                      </div>
                      <div className="box-root" style={{ borderColor: '#5469d4', width: '86.6px', height: '64px' }}>
                        <div className="box-root box-background--blue800" style={{ width: '100%', height: '100%', opacity: 0.4 }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ligne 2 - Carrés cyan */}
          <div className="box-root flex-flex" style={{ gridArea: 'top-gutter / left-gutter / bottom-gutter / left-gutter' }}>
            <div className="box-root animationLeftRight tans4s">
              <div className="box-root flex-flex flex-direction--column">
                <div className="box-root flex-flex">
                  <div className="box-root" style={{ borderColor: '#7fd3ed', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--cyan200" style={{ width: '100%', height: '100%', opacity: 0.3 }}></div>
                  </div>
                  <div className="box-root" style={{ borderColor: '#7fd3ed', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--cyan200" style={{ width: '100%', height: '100%', opacity: 0.5 }}></div>
                  </div>
                  <div className="box-root" style={{ borderColor: '#7fd3ed', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--cyan200" style={{ width: '100%', height: '100%', opacity: 0.3 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ligne 3 - Carrés gris */}
          <div className="box-root flex-flex" style={{ gridArea: 'top / left-gutter / bottom / left-gutter' }}>
            <div className="box-root animationRightLeft">
              <div className="box-root flex-flex flex-direction--column">
                <div className="box-root flex-flex">
                  <div className="box-root" style={{ borderColor: '#e3e8ee', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--gray100" style={{ width: '100%', height: '100%', opacity: 0.2 }}></div>
                  </div>
                  <div className="box-root" style={{ borderColor: '#e3e8ee', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--gray100" style={{ width: '100%', height: '100%', opacity: 0.4 }}></div>
                  </div>
                  <div className="box-root" style={{ borderColor: '#e3e8ee', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--gray100" style={{ width: '100%', height: '100%', opacity: 0.2 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ligne 4 - Carrés bleus supplémentaires */}
          <div className="box-root flex-flex" style={{ gridArea: 'top / right-gutter / bottom / right-gutter' }}>
            <div className="box-root animationLeftRight tans3s">
              <div className="box-root flex-flex flex-direction--column">
                <div className="box-root flex-flex">
                  <div className="box-root" style={{ borderColor: '#5469d4', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--blue" style={{ width: '100%', height: '100%', opacity: 0.3 }}></div>
                  </div>
                  <div className="box-root" style={{ borderColor: '#5469d4', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--blue800" style={{ width: '100%', height: '100%', opacity: 0.5 }}></div>
                  </div>
                  <div className="box-root" style={{ borderColor: '#5469d4', width: '86.6px', height: '64px' }}>
                    <div className="box-root box-background--blue" style={{ width: '100%', height: '100%', opacity: 0.3 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de connexion */}
      <div className="box-root flex-flex flex-direction--column" style={{ minHeight: '100vh', flexGrow: 1, zIndex: 9 }}>
        <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
          <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <h1 style={{ color: '#1a1f36', fontSize: '32px', fontWeight: 700 }}>Connexion</h1>
          </div>
          <div className="formbg">
            <div className="formbg-inner padding-horizontal--48">
              <span className="padding-bottom--15">Accéder à votre espace</span>
              
              <form onSubmit={handleSubmit} className="padding-bottom--15">
                {/* Champ Email */}
                <div className="field padding-bottom--24">
                  <label htmlFor="email">Adresse email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Champ Mot de passe */}
                <div className="field padding-bottom--24">
                  <div className="grid--50-50">
                    <label htmlFor="password">Mot de passe</label>
                    <div className="reset-pass">
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        Mot de passe oublié?
                      </a>
                    </div>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Checkbox Se souvenir de moi */}
                <div className="field field-checkbox padding-bottom--24 flex-flex align-center">
                  <label htmlFor="remember">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Se souvenir de moi
                  </label>
                </div>

                {/* Bouton de connexion */}
                <div className="field padding-bottom--24">
                  <input type="submit" value="Se connecter" />
                </div>

               
              </form>

              
              <div className="footer-link padding-top--24">
                
                <div className="listing padding-top--24 padding-bottom--24 flex-flex align-center center-center">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Conditions
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Confidentialité
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Aide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;