// Routes pour les utilisateurs
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersByRole
} = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes accessibles par directeur uniquement
router.get('/', authorize('directeur'), getUsers);
router.get('/role/:role', getUsersByRole);
router.get('/:id', authorize('directeur'), getUser);
router.put('/:id', authorize('directeur'), updateUser);
router.delete('/:id', authorize('directeur'), deleteUser);

module.exports = router;
