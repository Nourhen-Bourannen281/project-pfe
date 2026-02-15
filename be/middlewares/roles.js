// middlewares/roles.js

// Middleware pour autoriser certains rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Non authentifié" 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès refusé : rôle non autorisé. Rôles requis: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Autorise uniquement l'utilisateur à modifier son propre profil
const authorizeSelf = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Non authentifié" 
      });
    }

    if (req.user.id === req.params.id || req.user.role === 'admin') {
      return next();
    }

    return res.status(403).json({ 
      message: "Accès refusé : vous ne pouvez modifier que votre propre profil" 
    });
  };
};

// Autorise l'utilisateur à modifier son propre profil OU certains rôles
const authorizeSelfOrRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Non authentifié" 
      });
    }

    if (req.user.id === req.params.id || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ 
      message: "Accès refusé : rôle non autorisé" 
    });
  };
};

module.exports = { 
  authorize,
  authorizeSelf,
  authorizeSelfOrRoles 
};