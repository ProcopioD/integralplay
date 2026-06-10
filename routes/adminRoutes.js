const express = require('express');
const router = express.Router();
const { listarUsuarios, atualizarStatusUsuario, listarEspacosPendentes, relatorio } = require('../controllers/adminController');
const { atualizarStatus } = require('../controllers/espacoController');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

// Todas as rotas admin exigem autenticação e perfil admin
router.use(autenticar, autorizar('admin'));

// GET /admin/usuarios — lista todos os usuários
router.get('/usuarios', listarUsuarios);

// PATCH /admin/usuarios/:id/status — suspende ou reativa usuário
router.patch('/usuarios/:id/status', atualizarStatusUsuario);

// GET /admin/espacos/pendentes — lista espaços aguardando aprovação
router.get('/espacos/pendentes', listarEspacosPendentes);

// PATCH /admin/espacos/:id/status — aprova ou reprova espaço
router.patch('/espacos/:id/status', atualizarStatus);

// GET /admin/relatorio — relatório geral da plataforma
router.get('/relatorio', relatorio);

module.exports = router;