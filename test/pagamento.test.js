const request = require('supertest');  // Importando o supertest para fazer as requisições
const { expect } = require('chai');   // Importando o chai para as asserções
const app = require('../server');     // Importando a aplicação Express


describe('POST /api/pagamento', function() {
  it('should process a payment successfully', async function() {
    const res = await request(app)
      .post('/api/pagamento')
      .send({
        usuario_id: 1,
        reserva_id: 1,
        valor: 50.00,
        metodo_pagamento: 'cartão de crédito'
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Pagamento processado com sucesso!');
  });
});
