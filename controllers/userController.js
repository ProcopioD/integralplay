const db = require('../models/db');

// Função para cadastrar um novo usuário
exports.cadastrarUsuario = (req, res) => {
  const { nome, email, senha, telefone, nascimento, endereco, regiao, genero, noticias } = req.body;

  const query = `INSERT INTO usuarios (nome, email, senha, telefone, nascimento, endereco, regiao, genero, noticias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [nome, email, senha, telefone, nascimento, endereco, regiao, genero, noticias], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao cadastrar usuário', error: err });
    }
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
  });
};

// Função para consultar um usuário pelo email
exports.consultarUsuario = (req, res) => {
  const email = req.params.email;
  const query = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao consultar usuário', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(result[0]);
  });
};
