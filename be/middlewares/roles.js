// middlewares/roles.js

// Vérifie que l'utilisateur modifie son propre profil OU qu'il a un rôle autorisé
const authorizeSelfOrRoles = (...roles) => {
  return (req, res, next) => {
    // Autoriser si c'est son propre profil
    if (req.user.id === req.params.id) {
      return next();
    }
    // Autoriser si le rôle est dans la liste
    if (roles.includes(req.user.role)) {
      return next();
    }
    // Sinon, refus
    return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
  };
};

module.exports = { authorizeSelfOrRoles };
