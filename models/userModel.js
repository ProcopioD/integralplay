const db = require('./db');

// Função para cadastrar um usuário
exports.cadastrarUsuario = (nome, email, senha, telefone, nascimento, endereco, regiao, genero, noticias, callback) => {
  const query = `INSERT INTO usuarios (nome, email, senha, telefone, nascimento, endereco, regiao, genero, noticias) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [nome, email, senha, telefone, nascimento, endereco, regiao, genero, noticias], (err, result) => {
    callback(err, result);
  });
};

// Função para consultar um usuário pelo email
exports.consultarUsuarioPorEmail = (email, callback) => {
  const query = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(query, [email], (err, result) => {
    callback(err, result);
  });
};
