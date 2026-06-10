const Notificacao = require('../models/Notificacao');

// ─── LISTAR NOTIFICAÇÕES DO USUÁRIO ───────────────────────────────────────────
const listar = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const notificacoes = await Notificacao.find({ usuario_id })
      .sort({ created_at: -1 })
      .limit(30);

    return res.status(200).json(notificacoes);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar notificações.' });
  }
};

// ─── MARCAR NOTIFICAÇÃO COMO LIDA ────────────────────────────────────────────
const marcarLida = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const notificacao = await Notificacao.findOneAndUpdate(
      { _id: id, usuario_id },
      { lida: true },
      { new: true }
    );

    if (!notificacao) return res.status(404).json({ erro: 'Notificação não encontrada.' });

    return res.status(200).json({ mensagem: 'Notificação marcada como lida!' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar notificação.' });
  }
};

// ─── MARCAR TODAS COMO LIDAS ─────────────────────────────────────────────────
const marcarTodasLidas = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    await Notificacao.updateMany({ usuario_id, lida: false }, { lida: true });

    return res.status(200).json({ mensagem: 'Todas as notificações marcadas como lidas!' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar notificações.' });
  }
};

// ─── CONTAR NÃO LIDAS ────────────────────────────────────────────────────────
const contarNaoLidas = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const total = await Notificacao.countDocuments({ usuario_id, lida: false });

    return res.status(200).json({ total });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao contar notificações.' });
  }
};

module.exports = { listar, marcarLida, marcarTodasLidas, contarNaoLidas };
