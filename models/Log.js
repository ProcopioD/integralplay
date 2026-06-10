const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['login', 'cadastro', 'reserva', 'pagamento', 'cancelamento', 'avaliacao', 'admin']
  },
  descricao: {
    type: String,
    required: true
  },
  usuario_id: {
    type: Number,
    default: null
  },
  usuario_nome: {
    type: String,
    default: null
  },
  dados: {
    type: Object,
    default: {}
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);
