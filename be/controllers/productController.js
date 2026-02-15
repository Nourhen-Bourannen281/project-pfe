const Product = require('../models/Product');

// GET all products avec pagination et recherche
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Recherche par nom ou description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: products.map(p => ({
        id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        quantity: p.quantity, // ✅ ajout
      })),
    });
  } catch (error) {
    next(error);
  }
};

// GET single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });

    res.status(200).json({
      success: true,
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity, // ✅ ajout
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREATE product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity, // ✅ ajout
      }
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE product
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity, // ✅ ajout
      }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.json({ success: true, message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

