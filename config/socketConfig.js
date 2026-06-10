const jwt = require('jsonwebtoken');
const Mensagem = require('../models/Mensagem');

const configurarSocket = (io) => {

  // Middleware de autenticação do Socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Token não fornecido.'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.usuario = decoded;
      next();
    } catch (err) {
      return next(new Error('Token inválido.'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Usuário conectado ao chat: ${socket.usuario.nome}`);

    // ── ENTRAR NA SALA ────────────────────────────────────────────────────────
    socket.on('entrar_sala', ({ espaco_id, usuario_id }) => {
      const sala = `espaco_${espaco_id}_usuario_${usuario_id}`;
      socket.join(sala);
      console.log(`${socket.usuario.nome} entrou na sala: ${sala}`);
    });

    // ── ENVIAR MENSAGEM ───────────────────────────────────────────────────────
    socket.on('enviar_mensagem', async ({ espaco_id, usuario_id, texto }) => {
      if (!texto || !texto.trim()) return;

      const sala = `espaco_${espaco_id}_usuario_${usuario_id}`;

      try {
        // Salva mensagem no MongoDB
        const mensagem = await Mensagem.create({
          sala,
          espaco_id,
          usuario_id,
          remetente_id: socket.usuario.id,
          remetente_nome: socket.usuario.nome,
          remetente_perfil: socket.usuario.perfil,
          texto: texto.trim()
        });

        // Envia para todos na sala em tempo real
        io.to(sala).emit('nova_mensagem', {
          _id: mensagem._id,
          remetente_nome: mensagem.remetente_nome,
          remetente_perfil: mensagem.remetente_perfil,
          texto: mensagem.texto,
          created_at: mensagem.created_at
        });

      } catch (err) {
        console.error('Erro ao salvar mensagem:', err.message);
        socket.emit('erro_mensagem', { erro: 'Erro ao enviar mensagem.' });
      }
    });

    // ── DIGITANDO ─────────────────────────────────────────────────────────────
    socket.on('digitando', ({ espaco_id, usuario_id }) => {
      const sala = `espaco_${espaco_id}_usuario_${usuario_id}`;
      socket.to(sala).emit('usuario_digitando', { nome: socket.usuario.nome });
    });

    // ── DESCONECTAR ───────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`Usuário desconectado do chat: ${socket.usuario.nome}`);
    });
  });
};

module.exports = configurarSocket;
