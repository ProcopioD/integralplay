const express = require('express');
const router = express.Router();
const { listarPorEspaco, cadastrar, atualizar, disponibilidade, bloquear } = require('../controllers/quadraController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// GET /quadras/espaco/:espaco_id — lista quadras de um espaço (público)
router.get('/espaco/:espaco_id', listarPorEspaco);

// GET /quadras/:id/disponibilidade?data=YYYY-MM-DD — horários disponíveis (público)
router.get('/:id/disponibilidade', disponibilidade);

// POST /quadras — cadastra nova quadra (apenas dono)
router.post('/', autenticar, autorizar('dono'), cadastrar);

// PUT /quadras/:id — atualiza quadra (apenas dono)
router.put('/:id', autenticar, autorizar('dono'), atualizar);

// POST /quadras/:id/bloqueio — bloqueia horário (apenas dono)
router.post('/:id/bloqueio', autenticar, autorizar('dono'), bloquear);

module.exports = router;