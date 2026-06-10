const express = require('express');
const router = express.Router();
const { listar } = require('../controllers/logController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// GET /logs — lista logs da plataforma (apenas admin)
router.get('/', autenticar, autorizar('admin'), listar);

module.exports = router;
