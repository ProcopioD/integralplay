const express = require('express');
const router = express.Router();
const { listar, marcarLida, marcarTodasLidas, contarNaoLidas } = require('../controllers/notificacaoController');
const { autenticar } = require('../middleware/authMiddleware');

// Todas as rotas exigem autenticação
router.use(autenticar);

// GET /notificacoes — lista notificações do usuário logado
router.get('/', listar);

// GET /notificacoes/nao-lidas — conta notificações não lidas
router.get('/nao-lidas', contarNaoLidas);

// PATCH /notificacoes/todas-lidas — marca todas como lidas
router.patch('/todas-lidas', marcarTodasLidas);

// PATCH /notificacoes/:id/lida — marca uma notificação como lida
router.patch('/:id/lida', marcarLida);

module.exports = router;
