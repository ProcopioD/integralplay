const db = require('../models/db');

// ─── LISTAR TODOS OS ESPAÇOS ATIVOS (com filtros opcionais) ──────────────────
const listar = (req, res) => {
  const { esporte, cidade } = req.query;

  let query = `
    SELECT 
      e.id, e.nome, e.descricao, e.endereco, e.cidade, e.status,
      ROUND(AVG(a.nota), 1) AS media_avaliacao,
      COUNT(DISTINCT a.id)  AS total_avaliacoes,
      MIN(q.preco_hora)     AS menor_preco
    FROM espacos_esportivos e
    LEFT JOIN avaliacoes a ON a.espaco_id = e.id
    LEFT JOIN quadras q    ON q.espaco_id = e.id AND q.status = 'ativa'
    WHERE e.status = 'ativo'
  `;
  const params = [];

  if (cidade) {
    query += ' AND e.cidade LIKE ?';
    params.push(`%${cidade}%`);
  }

  if (esporte) {
    query += ' AND q.esporte = ?';
    params.push(esporte);
  }

  query += ' GROUP BY e.id ORDER BY media_avaliacao DESC';

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar espaços.' });
    return res.status(200).json(results);
  });
};

// ─── DETALHES DE UM ESPAÇO ────────────────────────────────────────────────────
const detalhar = (req, res) => {
  const { id } = req.params;

  // Busca dados do espaço
  db.query(
    `SELECT e.*, u.nome AS nome_dono, u.telefone AS telefone_dono
     FROM espacos_esportivos e
     JOIN usuarios u ON u.id = e.dono_id
     WHERE e.id = ? AND e.status = 'ativo'`,
    [id],
    (err, espacos) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar espaço.' });
      if (espacos.length === 0) return res.status(404).json({ erro: 'Espaço não encontrado.' });

      const espaco = espacos[0];

      // Busca quadras do espaço
      db.query(
        "SELECT * FROM quadras WHERE espaco_id = ? AND status = 'ativa'",
        [id],
        (err, quadras) => {
          if (err) return res.status(500).json({ erro: 'Erro ao buscar quadras.' });

          // Busca avaliações do espaço
          db.query(
            `SELECT a.nota, a.comentario, a.created_at, u.nome AS nome_usuario
             FROM avaliacoes a
             JOIN usuarios u ON u.id = a.usuario_id
             WHERE a.espaco_id = ?
             ORDER BY a.created_at DESC`,
            [id],
            (err, avaliacoes) => {
              if (err) return res.status(500).json({ erro: 'Erro ao buscar avaliações.' });

              // Busca regras do espaço
              db.query(
                'SELECT descricao FROM regras_espaco WHERE espaco_id = ?',
                [id],
                (err, regras) => {
                  if (err) return res.status(500).json({ erro: 'Erro ao buscar regras.' });

                  return res.status(200).json({
                    ...espaco,
                    quadras,
                    avaliacoes,
                    regras: regras.map(r => r.descricao)
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

// ─── CADASTRAR NOVO ESPAÇO (dono) ─────────────────────────────────────────────
const cadastrar = (req, res) => {
  const { nome, descricao, endereco, cidade } = req.body;
  const dono_id = req.usuario.id;

  if (!nome || !endereco || !cidade) {
    return res.status(400).json({ erro: 'Nome, endereço e cidade são obrigatórios.' });
  }

  db.query(
    'INSERT INTO espacos_esportivos (dono_id, nome, descricao, endereco, cidade) VALUES (?, ?, ?, ?, ?)',
    [dono_id, nome, descricao || null, endereco, cidade],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar espaço.' });
      return res.status(201).json({
        mensagem: 'Espaço cadastrado! Aguardando aprovação do administrador.',
        espaco_id: result.insertId
      });
    }
  );
};

// ─── ATUALIZAR ESPAÇO (dono) ──────────────────────────────────────────────────
const atualizar = (req, res) => {
  const { id } = req.params;
  const { nome, descricao, endereco, cidade } = req.body;
  const dono_id = req.usuario.id;

  db.query(
    'UPDATE espacos_esportivos SET nome = ?, descricao = ?, endereco = ?, cidade = ? WHERE id = ? AND dono_id = ?',
    [nome, descricao, endereco, cidade, id, dono_id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar espaço.' });
      if (result.affectedRows === 0) return res.status(404).json({ erro: 'Espaço não encontrado ou sem permissão.' });
      return res.status(200).json({ mensagem: 'Espaço atualizado com sucesso!' });
    }
  );
};

// ─── APROVAR OU REPROVAR ESPAÇO (admin) ───────────────────────────────────────
const atualizarStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['ativo', 'reprovado'].includes(status)) {
    return res.status(400).json({ erro: 'Status inválido. Use "ativo" ou "reprovado".' });
  }

  db.query(
    'UPDATE espacos_esportivos SET status = ? WHERE id = ?',
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar status.' });
      if (result.affectedRows === 0) return res.status(404).json({ erro: 'Espaço não encontrado.' });
      return res.status(200).json({ mensagem: `Espaço ${status === 'ativo' ? 'aprovado' : 'reprovado'} com sucesso!` });
    }
  );
};

module.exports = { listar, detalhar, cadastrar, atualizar, atualizarStatus };