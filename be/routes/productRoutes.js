// routes/productRoutes.js
const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middlewares/auth");
const { authorize } = require("../middlewares/roles"); // ✅ import correct

// Toutes les routes produits nécessitent auth
router.use(protect);

// Routes accessibles à tous les utilisateurs authentifiés
router.get("/", getProducts);
router.get("/:id", getProduct);

// Routes réservées au directeur
router.post("/", authorize("responsable_stock", "directeur"), createProduct);
router.put("/:id", authorize("responsable_stock","directeur"), updateProduct);
// routes/productRoutes.js
router.delete("/:id", authorize("responsable_stock", "directeur"), deleteProduct);

module.exports = router;
