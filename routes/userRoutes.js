const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para criar um novo usuário
router.post('/cadastro', userController.cadastrarUsuario);

// Rota para consultar um usuário pelo email
router.get('/:email', userController.consultarUsuario);

module.exports = router;
