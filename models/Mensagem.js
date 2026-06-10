const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
  sala: {
    type: String,
    required: true // formato: "espaco_ID_usuario_ID"
  },
  espaco_id: {
    type: Number,
    required: true
  },
  usuario_id: {
    type: Number,
    required: true
  },
  remetente_id: {
    type: Number,
    required: true
  },
  remetente_nome: {
    type: String,
    required: true
  },
  remetente_perfil: {
    type: String,
    enum: ['cliente', 'dono', 'admin'],
    required: true
  },
  texto: {
    type: String,
    required: true
  },
  lida: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mensagem', mensagemSchema);
