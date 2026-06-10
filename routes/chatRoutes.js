const express = require('express');
const router = express.Router();
const { historico, conversasDoEspaco } = require('../controllers/chatController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// GET /chat/:espaco_id/:usuario_id — histórico da conversa
router.get('/:espaco_id/:usuario_id', autenticar, historico);

// GET /chat/espaco/:espaco_id — lista conversas do espaço (dono/atendente)
router.get('/espaco/:espaco_id', autenticar, autorizar('dono', 'admin'), conversasDoEspaco);

module.exports = router;
