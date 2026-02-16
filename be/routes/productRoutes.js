// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect } = require("../middlewares/auth");

// =============== MIDDLEWARE SIMPLE ===============

// Vérifie si l'utilisateur est responsable stock
const isResponsableStock = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  console.log("🔍 Vérification rôle:", req.user.role);

  if (req.user.role === "responsable_stock") {
    console.log("✅ Responsable stock - Accès autorisé");
    return next();
  }

  console.log("❌ Accès refusé - Réservé au responsable stock");
  return res.status(403).json({ 
    message: "Accès refusé : réservé au responsable stock" 
  });
};

// =============== ROUTES PRODUITS ===============

// ✅ GET tous les produits (accessible à tous les utilisateurs connectés)
router.get("/", protect, async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ✅ GET un produit par ID
router.get("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ✅ POST - Ajouter un produit (responsable stock seulement)
router.post("/", protect, isResponsableStock, async (req, res) => {
  try {
    console.log("🔄 Ajout d'un nouveau produit:", req.body);
    
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: "Produit ajouté avec succès",
      data: product
    });
  } catch (error) {
    console.error("❌ Erreur ajout produit:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur", 
      error: error.message 
    });
  }
});

// ✅ PUT - Modifier un produit (responsable stock seulement)
router.put("/:id", protect, isResponsableStock, async (req, res) => {
  try {
    console.log("🔄 Modification produit ID:", req.params.id);
    console.log("📝 Données:", req.body);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: "Produit non trouvé" 
      });
    }

    res.json({
      success: true,
      message: "Produit modifié avec succès",
      data: updatedProduct
    });
  } catch (error) {
    console.error("❌ Erreur modification produit:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur", 
      error: error.message 
    });
  }
});

// ✅ DELETE - Supprimer un produit (responsable stock seulement)
router.delete("/:id", protect, isResponsableStock, async (req, res) => {
  try {
    console.log("🗑️ Suppression produit ID:", req.params.id);

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Produit non trouvé" 
      });
    }

    res.json({
      success: true,
      message: "Produit supprimé avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur suppression produit:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur", 
      error: error.message 
    });
  }
});

module.exports = router;