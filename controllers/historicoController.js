exports.consultarHistorico = (req, res) => {
  const { usuario_id } = req.params;

  // Simulação de histórico de reservas
  const historico = [
    { id: 1, usuario_id, quadra_nome: 'Quadra A', data: '2023-05-01', status: 'passada' },
    { id: 2, usuario_id, quadra_nome: 'Quadra B', data: '2023-06-01', status: 'futura' }
  ];

  res.status(200).json(historico);
};
