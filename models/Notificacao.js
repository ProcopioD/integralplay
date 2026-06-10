const mongoose = require('mongoose');

const notificacaoSchema = new mongoose.Schema({
  usuario_id: {
    type: Number,
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['reserva', 'pagamento', 'cancelamento', 'lembrete', 'avaliacao'],
    required: true
  },
  lida: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Notificacao', notificacaoSchema);
