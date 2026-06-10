const express = require('express');
const router = express.Router();
const { cadastrar, login } = require('../controllers/authController');
 
// POST /auth/cadastro — cria novo usuário (cliente ou dono)
router.post('/cadastro', cadastrar);
 
// POST /auth/login — autentica e retorna JWT
router.post('/login', login);
 
module.exports = router;