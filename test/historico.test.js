const request = require('supertest');  // Importando o supertest para fazer as requisições
const { expect } = require('chai');   // Importando o chai para as asserções
const app = require('../server');     // Importando a aplicação Express


describe('GET /api/historico/:usuario_id', function() {
  it('should return reservation history for the specified user', async function() {
    const res = await request(app)
      .get('/api/historico/1'); // Substitua pelo ID do usuário

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('usuario_id');
  });
});
