const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roles');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', getProducts);
router.get('/:id', getProduct);

// Routes restreintes au directeur (gestion des produits)
// Ici, le directeur peut créer, mettre à jour ou supprimer un produit
// et donc gérer aussi la quantité disponible
router.post('/', authorize('directeur'), createProduct);
router.put('/:id', authorize('directeur'), updateProduct);
router.delete('/:id', authorize('directeur'), deleteProduct);

module.exports = router;
