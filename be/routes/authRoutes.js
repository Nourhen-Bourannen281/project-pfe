// Routes pour l'authentification
const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Route publique : connexion
router.post('/login', login);

// Route privée : récupérer l'utilisateur connecté
router.get('/me', protect, getMe);

module.exports = router;
