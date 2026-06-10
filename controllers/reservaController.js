const db = require('../models/db');

// Função para fazer uma nova reserva
exports.fazerReserva = (req, res) => {
  const { usuario_id, quadra_nome, data, horario_inicio, horario_fim } = req.body;

  const query = `INSERT INTO reservas (usuario_id, quadra_nome, data, horario_inicio, horario_fim) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [usuario_id, quadra_nome, data, horario_inicio, horario_fim], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer reserva', error: err });
    }
    res.status(201).json({ message: 'Reserva realizada com sucesso!', id: result.insertId });
  });
};

// Função para consultar as reservas de um usuário
exports.consultarReservas = (req, res) => {
  const usuario_id = req.params.usuario_id;
  const query = 'SELECT * FROM reservas WHERE usuario_id = ?';

  db.query(query, [usuario_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao consultar reservas', error: err });
    }
    res.status(200).json(result);
  });
};
