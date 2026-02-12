const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // id est implicite : MongoDB génère automatiquement _id
  name: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  qrCode: {
     type: String,
     unique: true,
     sparse: true  },
  quantity: {
    type: Number,
    required: [true, 'La quantité disponible est obligatoire'],
    min: [0, 'La quantité ne peut pas être négative'],
    default: 0
  }
}, {
  timestamps: true // ajoute automatiquement createdAt et updatedAt
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
