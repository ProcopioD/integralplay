const Log = require('../models/Log');

// ─── LISTAR LOGS (admin) ──────────────────────────────────────────────────────
const listar = async (req, res) => {
  try {
    const { tipo, limite = 50 } = req.query;

    const filtro = tipo ? { tipo } : {};

    const logs = await Log.find(filtro)
      .sort({ created_at: -1 })
      .limit(parseInt(limite));

    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar logs.' });
  }
};

module.exports = { listar };
