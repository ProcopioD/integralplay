const db = require('../models/db');
const { criarNotificacao } = require('../services/notificacaoService');
const { salvarLog } = require('../services/logService');

// ─── CRIAR PAGAMENTO (simulado) ───────────────────────────────────────────────
const criar = (req, res) => {
  const { reserva_id, metodo } = req.body;
  const usuario_id = req.usuario.id;

  if (!reserva_id || !metodo) {
    return res.status(400).json({ erro: 'Campos obrigatórios: reserva_id, metodo.' });
  }

  if (!['pix', 'cartao', 'boleto'].includes(metodo)) {
    return res.status(400).json({ erro: 'Método inválido. Use: pix, cartao ou boleto.' });
  }

  // Busca a reserva e verifica se pertence ao usuário
  db.query(
    'SELECT * FROM reservas WHERE id = ? AND usuario_id = ?',
    [reserva_id, usuario_id],
    (err, reservas) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar reserva.' });
      if (reservas.length === 0) return res.status(404).json({ erro: 'Reserva não encontrada.' });

      const reserva = reservas[0];

      if (reserva.status === 'confirmada') {
        return res.status(400).json({ erro: 'Essa reserva já foi paga.' });
      }

      if (reserva.status === 'cancelada') {
        return res.status(400).json({ erro: 'Não é possível pagar uma reserva cancelada.' });
      }

      // Verifica se já existe pagamento aprovado para essa reserva
      db.query(
        'SELECT id FROM pagamentos WHERE reserva_id = ? AND status = "aprovado"',
        [reserva_id],
        (err, pagamentos) => {
          if (err) return res.status(500).json({ erro: 'Erro ao verificar pagamento.' });
          if (pagamentos.length > 0) return res.status(400).json({ erro: 'Pagamento já aprovado para essa reserva.' });

          // Simula aprovação do pagamento
          db.query(
            'INSERT INTO pagamentos (reserva_id, metodo, status, valor) VALUES (?, ?, "aprovado", ?)',
            [reserva_id, metodo, reserva.valor_total],
            async (err, result) => {
              if (err) return res.status(500).json({ erro: 'Erro ao registrar pagamento.' });

              // Atualiza status da reserva para confirmada
              db.query(
                'UPDATE reservas SET status = "confirmada" WHERE id = ?',
                [reserva_id],
                async (err) => {
                  if (err) return res.status(500).json({ erro: 'Erro ao confirmar reserva.' });

                  // Salva notificação no MongoDB
                  await criarNotificacao(
                    usuario_id,
                    '✅ Reserva Confirmada!',
                    `Seu pagamento via ${metodo.toUpperCase()} foi aprovado. Reserva #${reserva_id} confirmada com sucesso!`,
                    'pagamento',
                    { reserva_id, metodo, valor: reserva.valor_total }
                  );

                  // Salva log no MongoDB
                  await salvarLog(
                    'pagamento',
                    `Pagamento aprovado para reserva #${reserva_id} via ${metodo}`,
                    usuario_id,
                    req.usuario.nome,
                    { reserva_id, metodo, valor: reserva.valor_total }
                  );

                  return res.status(200).json({
                    mensagem: 'Pagamento aprovado! Reserva confirmada com sucesso.',
                    pagamento: {
                      id: result.insertId,
                      reserva_id,
                      metodo,
                      status: 'aprovado',
                      valor: reserva.valor_total
                    }
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

// ─── CONSULTAR STATUS DO PAGAMENTO ───────────────────────────────────────────
const consultar = (req, res) => {
  const { reserva_id } = req.params;
  const usuario_id = req.usuario.id;

  db.query(
    `SELECT p.id, p.metodo, p.status, p.valor, p.created_at
     FROM pagamentos p
     JOIN reservas r ON r.id = p.reserva_id
     WHERE p.reserva_id = ? AND r.usuario_id = ?`,
    [reserva_id, usuario_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar pagamento.' });
      if (results.length === 0) return res.status(404).json({ erro: 'Pagamento não encontrado.' });
      return res.status(200).json(results[0]);
    }
  );
};

module.exports = { criar, consultar };
