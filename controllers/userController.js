const bcrypt = require('bcrypt');
const db = require('../models/db');

// ─── BUSCAR USUÁRIO POR ID ────────────────────────────────────────────────────
const buscarPorId = (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT id, nome, email, telefone, perfil, status, created_at FROM usuarios WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
      if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
      return res.status(200).json(results[0]);
    }
  );
};

// ─── ATUALIZAR DADOS DO USUÁRIO ───────────────────────────────────────────────
const atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, senha } = req.body;

  // Só permite editar o próprio perfil
  if (parseInt(id) !== req.usuario.id) {
    return res.status(403).json({ erro: 'Você não tem permissão para editar este perfil.' });
  }

  if (!nome) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }

  try {
    if (senha && senha.length > 0) {
      // Atualiza com nova senha
      if (senha.length < 6) {
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
      }
      const senhaHash = await bcrypt.hash(senha, 10);
      db.query(
        'UPDATE usuarios SET nome = ?, telefone = ?, senha_hash = ? WHERE id = ?',
        [nome, telefone || null, senhaHash, id],
        (err) => {
          if (err) return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
          return res.status(200).json({ mensagem: 'Dados atualizados com sucesso!' });
        }
      );
    } else {
      // Atualiza sem mudar a senha
      db.query(
        'UPDATE usuarios SET nome = ?, telefone = ? WHERE id = ?',
        [nome, telefone || null, id],
        (err) => {
          if (err) return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
          return res.status(200).json({ mensagem: 'Dados atualizados com sucesso!' });
        }
      );
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

module.exports = { buscarPorId, atualizar };
