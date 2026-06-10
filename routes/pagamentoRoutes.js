const express = require('express');
const router = express.Router();
const { criar, consultar } = require('../controllers/pagamentoController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// POST /pagamentos — processa pagamento simulado (apenas cliente)
router.post('/', autenticar, autorizar('cliente'), criar);

// GET /pagamentos/:reserva_id — consulta status do pagamento (cliente)
router.get('/:reserva_id', autenticar, autorizar('cliente'), consultar);

module.exports = router;