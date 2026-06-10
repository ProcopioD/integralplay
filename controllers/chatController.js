const Mensagem = require('../models/Mensagem');

// ─── BUSCAR HISTÓRICO DE MENSAGENS DA SALA ────────────────────────────────────
const historico = async (req, res) => {
  const { espaco_id, usuario_id } = req.params;
  const sala = `espaco_${espaco_id}_usuario_${usuario_id}`;

  try {
    const mensagens = await Mensagem.find({ sala })
      .sort({ created_at: 1 })
      .limit(100);

    return res.status(200).json(mensagens);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar mensagens.' });
  }
};

// ─── LISTAR CONVERSAS DO ESPAÇO (para o atendente) ───────────────────────────
const conversasDoEspaco = async (req, res) => {
  const { espaco_id } = req.params;

  try {
    // Busca a última mensagem de cada sala do espaço
    const conversas = await Mensagem.aggregate([
      { $match: { espaco_id: parseInt(espaco_id) } },
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: '$sala',
          usuario_id: { $first: '$usuario_id' },
          ultima_mensagem: { $first: '$texto' },
          created_at: { $first: '$created_at' },
          nao_lidas: {
            $sum: { $cond: [{ $eq: ['$lida', false] }, 1, 0] }
          }
        }
      },
      { $sort: { created_at: -1 } }
    ]);

    return res.status(200).json(conversas);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar conversas.' });
  }
};

module.exports = { historico, conversasDoEspaco };
