const express = require('express');
const router = express.Router();
const { criar, listarPorEspaco, remover } = require('../controllers/avaliacaoController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// POST /avaliacoes — cria avaliação (apenas cliente)
router.post('/', autenticar, autorizar('cliente'), criar);

// GET /avaliacoes/espaco/:espaco_id — lista avaliações de um espaço (público)
router.get('/espaco/:espaco_id', listarPorEspaco);

// DELETE /avaliacoes/:id — remove avaliação (apenas admin)
router.delete('/:id', autenticar, autorizar('admin'), remover);

module.exports = router;