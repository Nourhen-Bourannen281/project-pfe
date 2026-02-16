const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/auth");
const { authorizeSelfOrRoles } = require("../middlewares/roles");

// ✅ GET profil
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
});

// ✅ PUT - Modifier son propre profil OU si rôle autorisé
router.put("/:id", protect, authorizeSelfOrRoles("directeur", "responsable_stock"), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.json({ success: true, message: "Profil mis à jour", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE - Supprimer son propre profil uniquement
router.delete("/:id", protect, authorizeSelfOrRoles(), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ success: true, message: "Votre profil a été supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
