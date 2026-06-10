const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { salvarLog } = require('../services/logService');

// ─── CADASTRO ───────────────────────────────────────────────────────────────
const cadastrar = async (req, res) => {
  const { nome, email, senha, telefone, perfil } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  const perfilFinal = perfil === 'dono' ? 'dono' : 'cliente';

  try {
    db.query('SELECT id FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao verificar email.' });
      if (results.length > 0) return res.status(409).json({ erro: 'Email já cadastrado.' });

      const senhaHash = await bcrypt.hash(senha, 10);

      db.query(
        'INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil) VALUES (?, ?, ?, ?, ?)',
        [nome, email, senhaHash, telefone || null, perfilFinal],
        async (err, result) => {
          if (err) return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });

          // Salva log no MongoDB
          await salvarLog(
            'cadastro',
            `Novo usuário cadastrado: ${nome} (${perfilFinal})`,
            result.insertId,
            nome,
            { email, perfil: perfilFinal }
          );

          return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: {
              id: result.insertId,
              nome,
              email,
              perfil: perfilFinal
            }
          });
        }
      );
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
    if (results.length === 0) return res.status(401).json({ erro: 'Email ou senha incorretos.' });

    const usuario = results[0];

    if (usuario.status === 'suspenso') {
      return res.status(403).json({ erro: 'Conta suspensa. Entre em contato com o suporte.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Email ou senha incorretos.' });

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Salva log no MongoDB
    await salvarLog(
      'login',
      `Usuário fez login: ${usuario.nome} (${usuario.perfil})`,
      usuario.id,
      usuario.nome,
      { email: usuario.email, perfil: usuario.perfil }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  });
};

module.exports = { cadastrar, login };
