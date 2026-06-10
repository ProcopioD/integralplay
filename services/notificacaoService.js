const Notificacao = require('../models/Notificacao');

// Cria uma notificação para um usuário
const criarNotificacao = async (usuario_id, titulo, mensagem, tipo, dados = {}) => {
  try {
    await Notificacao.create({ usuario_id, titulo, mensagem, tipo, dados });
  } catch (err) {
    console.error('Erro ao criar notificação:', err.message);
  }
};

module.exports = { criarNotificacao };
