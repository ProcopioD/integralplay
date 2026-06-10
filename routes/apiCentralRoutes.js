const express = require('express');
const router = express.Router();
const apiCentralController = require('../controllers/apiCentralController');

// Rota da API Centralizadora para buscar quadras de diferentes plataformas
router.get('/', apiCentralController.coletarDadosPlataformas);

module.exports = router;

// Simulação de quadras (essa lógica deve vir de diversas plataformas na vida real)
const quadras = [
  { nome: 'Quadra A', localizacao: 'Centro', disponibilidade: '08:00 - 18:00', preco: 'R$ 50,00' },
  { nome: 'Quadra B', localizacao: 'Zona Norte', disponibilidade: '10:00 - 20:00', preco: 'R$ 60,00' }
];

// Rota para consultar todas as quadras
router.get('/plataformas', (req, res) => {
  res.status(200).json(quadras);
});

// Rota para filtrar quadras por localizacao e precoMaximo
router.get('/plataformas/filtro', (req, res) => {
  const { localizacao, precoMaximo } = req.query;
  let quadrasFiltradas = quadras;

  if (localizacao) {
    quadrasFiltradas = quadrasFiltradas.filter(quadra => quadra.localizacao === localizacao);
  }
  if (precoMaximo) {
    quadrasFiltradas = quadrasFiltradas.filter(quadra => parseFloat(quadra.preco.replace('R$ ', '').replace(',', '.')) <= parseFloat(precoMaximo));
  }

  res.status(200).json(quadrasFiltradas);
});

// Rota para criar uma nova reserva
router.post('/reservas', (req, res) => {
  const { usuario_id, quadra_nome, data, horario_inicio, horario_fim } = req.body;
  const reserva = { usuario_id, quadra_nome, data, horario_inicio, horario_fim };
  res.status(201).json({ message: 'Reserva realizada com sucesso!', reserva });
});

// Rota para consultar as reservas de um usuário
router.get('/reservas/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  
  // Simulação de consulta de reservas para um usuário
  res.status(200).json([{ usuario_id, quadra_nome: 'Quadra A', data: '2023-06-01', horario_inicio: '10:00', horario_fim: '12:00' }]);
});

// Rota para atualizar uma reserva
router.put('/reservas/:id', (req, res) => {
  const { id } = req.params;
  const { data, horario_inicio, horario_fim } = req.body;
  const reservaAtualizada = { id, data, horario_inicio, horario_fim };
  res.status(200).json({ message: 'Reserva atualizada com sucesso!', reserva: reservaAtualizada });
});

// Rota para cancelar uma reserva
router.delete('/reservas/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: 'Reserva cancelada com sucesso!', reserva_id: id });
});

