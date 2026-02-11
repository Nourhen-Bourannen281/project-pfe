// Middleware pour vérifier les rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Vérifier si l'utilisateur a un rôle autorisé
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};

module.exports = { authorize };