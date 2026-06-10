exports.criarPagamento = (req, res) => {
  const { usuario_id, reserva_id, valor, metodo_pagamento } = req.body;

  // Simulação de pagamento
  const pagamento = {
    usuario_id,
    reserva_id,
    valor,
    metodo_pagamento,
    status: "Aprovado"
  };

  res.status(200).json({ message: 'Pagamento processado com sucesso!', pagamento });
};
