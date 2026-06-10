const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

// Rota GET para consultar histórico de reservas
router.get('/reservas/historico/:usuario_id', historicoController.consultarHistorico);

module.exports = router;
