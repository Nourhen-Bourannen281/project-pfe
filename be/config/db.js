const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI non défini dans le fichier .env');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error.message);
    // ❌ PAS de process.exit ici pendant le dev
  }
};

module.exports = connectDB;
