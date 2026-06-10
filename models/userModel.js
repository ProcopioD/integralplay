const db = require('./db');

// Busca usuário pelo email
exports.buscarPorEmail = (email, callback) => {
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
};

// Busca usuário pelo ID
exports.buscarPorId = (id, callback) => {
  db.query(
    'SELECT id, nome, email, telefone, perfil, status, created_at FROM usuarios WHERE id = ?',
    [id],
    callback
  );
};

// Lista todos os usuários (uso do admin)
exports.listarTodos = (callback) => {
  db.query(
    'SELECT id, nome, email, telefone, perfil, status, created_at FROM usuarios',
    callback
  );
};

// Atualiza status do usuário (ativo/suspenso)
exports.atualizarStatus = (id, status, callback) => {
  db.query('UPDATE usuarios SET status = ? WHERE id = ?', [status, id], callback);
};
