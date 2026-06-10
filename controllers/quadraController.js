const db = require('../models/db');

// ─── LISTAR QUADRAS DE UM ESPAÇO ─────────────────────────────────────────────
const listarPorEspaco = (req, res) => {
  const { espaco_id } = req.params;

  db.query(
    "SELECT * FROM quadras WHERE espaco_id = ? AND status = 'ativa'",
    [espaco_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar quadras.' });
      return res.status(200).json(results);
    }
  );
};

// ─── CADASTRAR QUADRA (dono) ──────────────────────────────────────────────────
const cadastrar = (req, res) => {
  const { espaco_id, nome, esporte, descricao, preco_hora, preco_mensal } = req.body;
  const dono_id = req.usuario.id;

  if (!espaco_id || !nome || !esporte || !preco_hora || !preco_mensal) {
    return res.status(400).json({ erro: 'Campos obrigatórios: espaco_id, nome, esporte, preco_hora, preco_mensal.' });
  }

  // Verifica se o espaço pertence ao dono
  db.query(
    'SELECT id FROM espacos_esportivos WHERE id = ? AND dono_id = ?',
    [espaco_id, dono_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar espaço.' });
      if (results.length === 0) return res.status(403).json({ erro: 'Espaço não encontrado ou sem permissão.' });

      db.query(
        'INSERT INTO quadras (espaco_id, nome, esporte, descricao, preco_hora, preco_mensal) VALUES (?, ?, ?, ?, ?, ?)',
        [espaco_id, nome, esporte, descricao || null, preco_hora, preco_mensal],
        (err, result) => {
          if (err) return res.status(500).json({ erro: 'Erro ao cadastrar quadra.' });
          return res.status(201).json({
            mensagem: 'Quadra cadastrada com sucesso!',
            quadra_id: result.insertId
          });
        }
      );
    }
  );
};

// ─── ATUALIZAR QUADRA (dono) ──────────────────────────────────────────────────
const atualizar = (req, res) => {
  const { id } = req.params;
  const { nome, esporte, descricao, preco_hora, preco_mensal, status } = req.body;
  const dono_id = req.usuario.id;

  // Verifica se a quadra pertence a um espaço do dono
  db.query(
    `SELECT q.id FROM quadras q
     JOIN espacos_esportivos e ON e.id = q.espaco_id
     WHERE q.id = ? AND e.dono_id = ?`,
    [id, dono_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar quadra.' });
      if (results.length === 0) return res.status(403).json({ erro: 'Quadra não encontrada ou sem permissão.' });

      db.query(
        'UPDATE quadras SET nome = ?, esporte = ?, descricao = ?, preco_hora = ?, preco_mensal = ?, status = ? WHERE id = ?',
        [nome, esporte, descricao, preco_hora, preco_mensal, status || 'ativa', id],
        (err) => {
          if (err) return res.status(500).json({ erro: 'Erro ao atualizar quadra.' });
          return res.status(200).json({ mensagem: 'Quadra atualizada com sucesso!' });
        }
      );
    }
  );
};

// ─── VERIFICAR DISPONIBILIDADE DE HORÁRIOS ────────────────────────────────────
const disponibilidade = (req, res) => {
  const { id } = req.params;
  const { data } = req.query; // formato: YYYY-MM-DD

  if (!data) {
    return res.status(400).json({ erro: 'Informe a data no formato YYYY-MM-DD.' });
  }

  // Busca reservas confirmadas nessa data
  db.query(
    `SELECT hora_inicio, hora_fim FROM reservas
     WHERE quadra_id = ? AND data = ? AND status IN ('pendente', 'confirmada')`,
    [id, data],
    (err, reservas) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar disponibilidade.' });

      // Horários padrão: 07h às 23h, blocos de 1 hora
      const horariosOcupados = reservas.map(r => r.hora_inicio.slice(0, 5));
      const todoHorarios = [];

      for (let hora = 7; hora < 23; hora++) {
        const horaStr = `${String(hora).padStart(2, '0')}:00`;
        todoHorarios.push({
          hora: horaStr,
          disponivel: !horariosOcupados.includes(horaStr)
        });
      }

      return res.status(200).json({
        quadra_id: id,
        data,
        horarios: todoHorarios
      });
    }
  );
};

// ─── BLOQUEAR HORÁRIO (dono) ──────────────────────────────────────────────────
const bloquear = (req, res) => {
  const { id } = req.params;
  const { data, hora_inicio, hora_fim, motivo } = req.body;
  const dono_id = req.usuario.id;

  if (!data) return res.status(400).json({ erro: 'Data é obrigatória.' });

  // Verifica se a quadra pertence ao dono
  db.query(
    `SELECT q.id FROM quadras q
     JOIN espacos_esportivos e ON e.id = q.espaco_id
     WHERE q.id = ? AND e.dono_id = ?`,
    [id, dono_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar quadra.' });
      if (results.length === 0) return res.status(403).json({ erro: 'Quadra não encontrada ou sem permissão.' });

      db.query(
        'INSERT INTO bloqueios (quadra_id, data, hora_inicio, hora_fim, motivo) VALUES (?, ?, ?, ?, ?)',
        [id, data, hora_inicio || null, hora_fim || null, motivo || null],
        (err) => {
          if (err) return res.status(500).json({ erro: 'Erro ao bloquear horário.' });
          return res.status(201).json({ mensagem: 'Horário bloqueado com sucesso!' });
        }
      );
    }
  );
};

module.exports = { listarPorEspaco, cadastrar, atualizar, disponibilidade, bloquear };