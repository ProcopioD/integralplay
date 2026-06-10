const db = require('../models/db');

// ─── CRIAR AVALIAÇÃO ──────────────────────────────────────────────────────────
const criar = (req, res) => {
  const { espaco_id, reserva_id, nota, comentario } = req.body;
  const usuario_id = req.usuario.id;

  if (!espaco_id || !reserva_id || !nota) {
    return res.status(400).json({ erro: 'Campos obrigatórios: espaco_id, reserva_id, nota.' });
  }

  if (nota < 1 || nota > 5) {
    return res.status(400).json({ erro: 'A nota deve ser entre 1 e 5.' });
  }

  // Verifica se a reserva pertence ao usuário e está concluída
  db.query(
    'SELECT id FROM reservas WHERE id = ? AND usuario_id = ? AND status = "concluida"',
    [reserva_id, usuario_id],
    (err, reservas) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar reserva.' });
      if (reservas.length === 0) return res.status(403).json({ erro: 'Reserva não encontrada ou ainda não concluída.' });

      // Verifica se já avaliou essa reserva
      db.query(
        'SELECT id FROM avaliacoes WHERE reserva_id = ?',
        [reserva_id],
        (err, existing) => {
          if (err) return res.status(500).json({ erro: 'Erro ao verificar avaliação.' });
          if (existing.length > 0) return res.status(409).json({ erro: 'Você já avaliou essa reserva.' });

          // Insere avaliação
          db.query(
            'INSERT INTO avaliacoes (usuario_id, espaco_id, reserva_id, nota, comentario) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, espaco_id, reserva_id, nota, comentario || null],
            (err, result) => {
              if (err) return res.status(500).json({ erro: 'Erro ao registrar avaliação.' });
              return res.status(201).json({
                mensagem: 'Avaliação registrada com sucesso!',
                avaliacao_id: result.insertId
              });
            }
          );
        }
      );
    }
  );
};

// ─── LISTAR AVALIAÇÕES DE UM ESPAÇO ───────────────────────────────────────────
const listarPorEspaco = (req, res) => {
  const { espaco_id } = req.params;

  db.query(
    `SELECT a.id, a.nota, a.comentario, a.created_at,
            u.nome AS nome_usuario
     FROM avaliacoes a
     JOIN usuarios u ON u.id = a.usuario_id
     WHERE a.espaco_id = ?
     ORDER BY a.created_at DESC`,
    [espaco_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar avaliações.' });
      return res.status(200).json(results);
    }
  );
};

// ─── REMOVER AVALIAÇÃO (admin) ────────────────────────────────────────────────
const remover = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM avaliacoes WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao remover avaliação.' });
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
    return res.status(200).json({ mensagem: 'Avaliação removida com sucesso!' });
  });
};

module.exports = { criar, listarPorEspaco, remover };