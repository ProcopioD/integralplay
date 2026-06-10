const db = require('../models/db');

// ─── LISTAR TODOS OS USUÁRIOS ─────────────────────────────────────────────────
const listarUsuarios = (req, res) => {
  db.query(
    'SELECT id, nome, email, telefone, perfil, status, created_at FROM usuarios ORDER BY created_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
      return res.status(200).json(results);
    }
  );
};

// ─── ATUALIZAR STATUS DO USUÁRIO (suspender/reativar) ─────────────────────────
const atualizarStatusUsuario = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['ativo', 'suspenso'].includes(status)) {
    return res.status(400).json({ erro: 'Status inválido. Use "ativo" ou "suspenso".' });
  }

  // Não permite suspender outro admin
  db.query('SELECT perfil FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
    if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    if (results[0].perfil === 'admin') return res.status(403).json({ erro: 'Não é possível suspender outro administrador.' });

    db.query('UPDATE usuarios SET status = ? WHERE id = ?', [status, id], (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar status.' });
      return res.status(200).json({ mensagem: `Usuário ${status === 'ativo' ? 'reativado' : 'suspenso'} com sucesso!` });
    });
  });
};

// ─── LISTAR ESPAÇOS PENDENTES DE APROVAÇÃO ────────────────────────────────────
const listarEspacosPendentes = (req, res) => {
  db.query(
    `SELECT e.id, e.nome, e.descricao, e.endereco, e.cidade, e.created_at,
            u.nome AS nome_dono, u.email AS email_dono, u.telefone AS telefone_dono
     FROM espacos_esportivos e
     JOIN usuarios u ON u.id = e.dono_id
     WHERE e.status = 'pendente'
     ORDER BY e.created_at ASC`,
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar espaços pendentes.' });
      return res.status(200).json(results);
    }
  );
};

// ─── RELATÓRIO GERAL DA PLATAFORMA ───────────────────────────────────────────
const relatorio = (req, res) => {
  const dados = {};

  // Total de usuários por perfil
  db.query(
    `SELECT perfil, COUNT(*) AS total FROM usuarios GROUP BY perfil`,
    (err, usuarios) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar relatório.' });
      dados.usuarios = usuarios;

      // Total de reservas por status
      db.query(
        `SELECT status, COUNT(*) AS total FROM reservas GROUP BY status`,
        (err, reservas) => {
          if (err) return res.status(500).json({ erro: 'Erro ao buscar reservas.' });
          dados.reservas = reservas;

          // Faturamento total
          db.query(
            `SELECT SUM(valor_total) AS faturamento_total FROM reservas WHERE status = 'confirmada'`,
            (err, faturamento) => {
              if (err) return res.status(500).json({ erro: 'Erro ao buscar faturamento.' });
              dados.faturamento_total = faturamento[0].faturamento_total || 0;

              // Espaços mais populares
              db.query(
                `SELECT e.nome, COUNT(r.id) AS total_reservas
                 FROM espacos_esportivos e
                 LEFT JOIN quadras q ON q.espaco_id = e.id
                 LEFT JOIN reservas r ON r.quadra_id = q.id
                 WHERE e.status = 'ativo'
                 GROUP BY e.id
                 ORDER BY total_reservas DESC
                 LIMIT 5`,
                (err, populares) => {
                  if (err) return res.status(500).json({ erro: 'Erro ao buscar espaços populares.' });
                  dados.espacos_mais_populares = populares;

                  return res.status(200).json(dados);
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = { listarUsuarios, atualizarStatusUsuario, listarEspacosPendentes, relatorio };