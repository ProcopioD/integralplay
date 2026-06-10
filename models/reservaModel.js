const db = require('./db');

// Função para fazer uma nova reserva
exports.fazerReserva = (usuario_id, quadra_nome, data, horario_inicio, horario_fim, callback) => {
  const query = `INSERT INTO reservas (usuario_id, quadra_nome, data, horario_inicio, horario_fim) 
                 VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [usuario_id, quadra_nome, data, horario_inicio, horario_fim], (err, result) => {
    callback(err, result);
  });
};

// Função para consultar as reservas de um usuário
exports.consultarReservasPorUsuario = (usuario_id, callback) => {
  const query = 'SELECT * FROM reservas WHERE usuario_id = ?';

  db.query(query, [usuario_id], (err, result) => {
    callback(err, result);
  });
};
