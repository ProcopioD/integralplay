const express = require('express');
const router = express.Router();
const { criar, listarPorUsuario, listarPorEspaco, cancelar, historico } = require('../controllers/reservaController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// POST /reservas — cria nova reserva (apenas cliente)
router.post('/', autenticar, autorizar('cliente'), criar);

// GET /reservas/minhas — reservas do cliente logado
router.get('/minhas', autenticar, autorizar('cliente'), listarPorUsuario);

// GET /reservas/espaco/:espaco_id — reservas de um espaço (apenas dono)
router.get('/espaco/:espaco_id', autenticar, autorizar('dono'), listarPorEspaco);

// PUT /reservas/:id/cancelar — cancela reserva (apenas cliente)
router.put('/:id/cancelar', autenticar, autorizar('cliente'), cancelar);

// GET /reservas/historico — histórico do cliente logado
router.get('/historico', autenticar, autorizar('cliente'), historico);

module.exports = router;