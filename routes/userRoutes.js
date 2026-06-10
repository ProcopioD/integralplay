const express = require('express');
const router = express.Router();
const { buscarPorId, atualizar } = require('../controllers/userController');
const { autenticar } = require('../middleware/authMiddleware');

// GET /usuarios/:id — busca dados do usuário
router.get('/:id', autenticar, buscarPorId);

// PUT /usuarios/:id — atualiza dados do usuário
router.put('/:id', autenticar, atualizar);

module.exports = router;
