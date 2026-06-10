const Log = require('../models/Log');

// Salva um log no MongoDB
const salvarLog = async (tipo, descricao, usuario_id = null, usuario_nome = null, dados = {}) => {
  try {
    await Log.create({ tipo, descricao, usuario_id, usuario_nome, dados });
  } catch (err) {
    console.error('Erro ao salvar log:', err.message);
  }
};

module.exports = { salvarLog };
