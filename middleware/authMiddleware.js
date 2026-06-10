const jwt = require('jsonwebtoken');

// ─── VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO ──────────────────────────────────
const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  // O token vem no formato: "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Formato de token inválido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // disponibiliza os dados do usuário na requisição
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

// ─── VERIFICA SE O USUÁRIO TEM O PERFIL NECESSÁRIO ──────────────────────────
// Uso: autorizar('admin') ou autorizar('dono', 'admin')
const autorizar = (...perfisPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado.' });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: 'Acesso negado. Permissão insuficiente.' });
    }

    next();
  };
};

module.exports = { autenticar, autorizar };