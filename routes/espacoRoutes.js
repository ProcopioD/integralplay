const express = require('express');
const router = express.Router();
const { listar, detalhar, cadastrar, atualizar, atualizarStatus } = require('../controllers/espacoController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// GET /espacos — lista todos os espaços ativos (público, com filtros ?esporte=&cidade=)
router.get('/', listar);

// GET /espacos/:id — detalhes de um espaço (público)
router.get('/:id', detalhar);

// POST /espacos — cadastra novo espaço (apenas dono)
router.post('/', autenticar, autorizar('dono'), cadastrar);

// PUT /espacos/:id — atualiza espaço (apenas dono do espaço)
router.put('/:id', autenticar, autorizar('dono'), atualizar);

// PATCH /espacos/:id/status — aprova ou reprova espaço (apenas admin)
router.patch('/:id/status', autenticar, autorizar('admin'), atualizarStatus);

module.exports = router;