const db = require('../models/db');

// ─── CRIAR RESERVA ────────────────────────────────────────────────────────────
const criar = (req, res) => {
  const { quadra_id, data, hora_inicio, hora_fim, tipo } = req.body;
  const usuario_id = req.usuario.id;

  if (!quadra_id || !data || !hora_inicio || !hora_fim) {
    return res.status(400).json({ erro: 'Campos obrigatórios: quadra_id, data, hora_inicio, hora_fim.' });
  }

  const tipoFinal = tipo === 'mensal' ? 'mensal' : 'pontual';

  db.query('SELECT preco_hora, preco_mensal FROM quadras WHERE id = ? AND status = "ativa"', [quadra_id], (err, quadras) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar quadra.' });
    if (quadras.length === 0) return res.status(404).json({ erro: 'Quadra não encontrada ou inativa.' });

    const quadra = quadras[0];

    db.query(
      `SELECT id FROM reservas
       WHERE quadra_id = ? AND data = ? AND status IN ('pendente', 'confirmada')
       AND NOT (hora_fim <= ? OR hora_inicio >= ?)`,
      [quadra_id, data, hora_inicio, hora_fim],
      (err, conflitos) => {
        if (err) return res.status(500).json({ erro: 'Erro ao verificar disponibilidade.' });
        if (conflitos.length > 0) return res.status(409).json({ erro: 'Horário indisponível. Já existe uma reserva nesse período.' });

        const [hIni, mIni] = hora_inicio.split(':').map(Number);
        const [hFim, mFim] = hora_fim.split(':').map(Number);
        const horas = ((hFim * 60 + mFim) - (hIni * 60 + mIni)) / 60;
        const valorTotal = tipoFinal === 'mensal'
          ? parseFloat(quadra.preco_mensal)
          : parseFloat((quadra.preco_hora * horas).toFixed(2));

        db.query(
          'INSERT INTO reservas (usuario_id, quadra_id, data, hora_inicio, hora_fim, tipo, valor_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [usuario_id, quadra_id, data, hora_inicio, hora_fim, tipoFinal, valorTotal],
          (err, result) => {
            if (err) return res.status(500).json({ erro: 'Erro ao criar reserva.' });
            return res.status(201).json({
              mensagem: 'Reserva criada com sucesso! Aguardando pagamento.',
              reserva_id: result.insertId,
              valor_total: valorTotal
            });
          }
        );
      }
    );
  });
};

// ─── LISTAR RESERVAS DO USUÁRIO ───────────────────────────────────────────────
const listarPorUsuario = (req, res) => {
  const usuario_id = req.usuario.id;

  db.query(
    `SELECT r.id, r.data, r.hora_inicio, r.hora_fim, r.tipo, r.status, r.valor_total,
            q.nome AS quadra, q.esporte,
            e.nome AS espaco, e.endereco
     FROM reservas r
     JOIN quadras q ON q.id = r.quadra_id
     JOIN espacos_esportivos e ON e.id = q.espaco_id
     WHERE r.usuario_id = ?
     ORDER BY r.data DESC, r.hora_inicio DESC`,
    [usuario_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar reservas.' });
      return res.status(200).json(results);
    }
  );
};

// ─── LISTAR RESERVAS DO ESPAÇO (dono) ────────────────────────────────────────
const listarPorEspaco = (req, res) => {
  const { espaco_id } = req.params;
  const dono_id = req.usuario.id;

  db.query(
    'SELECT id FROM espacos_esportivos WHERE id = ? AND dono_id = ?',
    [espaco_id, dono_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar espaço.' });
      if (results.length === 0) return res.status(403).json({ erro: 'Espaço não encontrado ou sem permissão.' });

      db.query(
        `SELECT r.id, r.data, r.hora_inicio, r.hora_fim, r.tipo, r.status, r.valor_total,
                q.nome AS quadra, q.esporte,
                u.nome AS cliente, u.telefone AS telefone_cliente, u.email AS email_cliente
         FROM reservas r
         JOIN quadras q ON q.id = r.quadra_id
         JOIN usuarios u ON u.id = r.usuario_id
         WHERE q.espaco_id = ?
         ORDER BY r.data DESC, r.hora_inicio DESC`,
        [espaco_id],
        (err, results) => {
          if (err) return res.status(500).json({ erro: 'Erro ao buscar reservas.' });
          return res.status(200).json(results);
        }
      );
    }
  );
};

// ─── EXPORTAR RESERVAS EM CSV (dono) ──────────────────────────────────────────
const exportarCsv = (req, res) => {
  const { espaco_id } = req.params;
  const dono_id = req.usuario.id;

  db.query(
    'SELECT id, nome FROM espacos_esportivos WHERE id = ? AND dono_id = ?',
    [espaco_id, dono_id],
    (err, espacos) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar espaço.' });
      if (espacos.length === 0) return res.status(403).json({ erro: 'Espaço não encontrado ou sem permissão.' });

      db.query(
        `SELECT r.id, r.data, r.hora_inicio, r.hora_fim, r.tipo, r.status, r.valor_total, r.created_at,
                q.nome AS quadra, q.esporte,
                u.nome AS cliente, u.telefone AS telefone_cliente, u.email AS email_cliente
         FROM reservas r
         JOIN quadras q ON q.id = r.quadra_id
         JOIN usuarios u ON u.id = r.usuario_id
         WHERE q.espaco_id = ?
         ORDER BY r.data DESC, r.hora_inicio DESC`,
        [espaco_id],
        (err, reservas) => {
          if (err) return res.status(500).json({ erro: 'Erro ao buscar reservas.' });

          // Monta cabeçalho do CSV
          const cabecalho = [
            'ID', 'Data', 'Hora Início', 'Hora Fim', 'Quadra', 'Esporte',
            'Cliente', 'Telefone', 'Email', 'Tipo', 'Status', 'Valor (R$)', 'Criado em'
          ].join(';');

          // Monta linhas do CSV
          const linhas = reservas.map(r => {
            const data = r.data ? new Date(r.data).toLocaleDateString('pt-BR') : '';
            const criado = r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '';
            return [
              r.id,
              data,
              r.hora_inicio?.slice(0, 5) || '',
              r.hora_fim?.slice(0, 5) || '',
              `"${r.quadra}"`,
              r.esporte,
              `"${r.cliente}"`,
              r.telefone_cliente || '',
              r.email_cliente,
              r.tipo,
              r.status,
              parseFloat(r.valor_total).toFixed(2).replace('.', ','),
              criado
            ].join(';');
          });

          const csv = '\uFEFF' + [cabecalho, ...linhas].join('\n'); // \uFEFF = BOM para acentos no Excel

          const nomeEspaco = espacos[0].nome.replace(/\s+/g, '_');
          const dataHoje = new Date().toISOString().split('T')[0];

          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; filename="reservas_${nomeEspaco}_${dataHoje}.csv"`);
          return res.status(200).send(csv);
        }
      );
    }
  );
};

// ─── CANCELAR RESERVA ─────────────────────────────────────────────────────────
const cancelar = (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;

  db.query(
    'SELECT * FROM reservas WHERE id = ? AND usuario_id = ?',
    [id, usuario_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar reserva.' });
      if (results.length === 0) return res.status(404).json({ erro: 'Reserva não encontrada.' });

      const reserva = results[0];

      if (reserva.status === 'cancelada') {
        return res.status(400).json({ erro: 'Reserva já está cancelada.' });
      }

      const agora = new Date();
      const dataReserva = new Date(`${reserva.data}T${reserva.hora_inicio}`);
      const diferencaHoras = (dataReserva - agora) / (1000 * 60 * 60);

      if (diferencaHoras < 24) {
        return res.status(400).json({ erro: 'Cancelamento não permitido com menos de 24h de antecedência.' });
      }

      db.query(
        'UPDATE reservas SET status = "cancelada" WHERE id = ?',
        [id],
        (err) => {
          if (err) return res.status(500).json({ erro: 'Erro ao cancelar reserva.' });
          return res.status(200).json({ mensagem: 'Reserva cancelada com sucesso!' });
        }
      );
    }
  );
};

// ─── HISTÓRICO DE RESERVAS ────────────────────────────────────────────────────
const historico = (req, res) => {
  const usuario_id = req.usuario.id;

  db.query(
    `SELECT r.id, r.data, r.hora_inicio, r.hora_fim, r.tipo, r.status, r.valor_total,
            q.nome AS quadra, q.esporte,
            e.nome AS espaco,
            a.nota AS avaliacao_nota
     FROM reservas r
     JOIN quadras q ON q.id = r.quadra_id
     JOIN espacos_esportivos e ON e.id = q.espaco_id
     LEFT JOIN avaliacoes a ON a.reserva_id = r.id
     WHERE r.usuario_id = ? AND r.status IN ('concluida', 'cancelada')
     ORDER BY r.data DESC`,
    [usuario_id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar histórico.' });
      return res.status(200).json(results);
    }
  );
};

module.exports = { criar, listarPorUsuario, listarPorEspaco, exportarCsv, cancelar, historico };
