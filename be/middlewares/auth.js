// Middleware pour vérifier l'authentification avec JWT
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans le header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token du header
      token = req.headers.authorization.split(' ')[1];
      
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Récupérer l'utilisateur sans le password
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Passer au prochain middleware
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      res.status(401).json({ 
        success: false, 
        message: 'Non autorisé, token invalide' 
      });
    }
  }

  if (!token) {
    res.status(401).json({ 
      success: false, 
      message: 'Non autorisé, pas de token' 
    });
  }
};

module.exports = { protect };