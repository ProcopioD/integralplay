const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');

// Rota POST para criar avaliação
router.post('/avaliacao', avaliacaoController.criarAvaliacao);

module.exports = router;
