const mongoose = require('mongoose');

const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  }
};

module.exports = conectarMongoDB;
