exports.criarAvaliacao = (req, res) => {
  const { usuario_id, quadra_nome, nota, comentario } = req.body;

  // Simulação de avaliação
  const avaliacao = {
    usuario_id,
    quadra_nome,
    nota,
    comentario
  };

  res.status(201).json({ message: 'Avaliação registrada com sucesso!', avaliacao });
};
