const jwt = require('jsonwebtoken');

// ─── VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO ──────────────────────────────────
const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    // Permite token via query string (necessário para downloads via <a>/window.open)
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

// ─── VERIFICA SE O USUÁRIO TEM O PERFIL NECESSÁRIO ──────────────────────────
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
