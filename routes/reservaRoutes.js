const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Rota para fazer uma reserva
router.post('/', reservaController.fazerReserva);

// Rota para consultar as reservas de um usuário
router.get('/:usuario_id', reservaController.consultarReservas);

module.exports = router;
