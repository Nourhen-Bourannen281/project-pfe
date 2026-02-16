// server.js
require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // ✅ Vérifiez cette ligne

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // ✅ Vérifiez cette ligne

// Route de test
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API fonctionne 🚀' });
});

const PORT = process.env.PORT || 5000;

// Connexion à la base et lancement du serveur
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`✅ Serveur lancé sur le port ${PORT}`)
  );
});