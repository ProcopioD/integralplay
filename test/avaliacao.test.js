const request = require('supertest');  // Importando o supertest para fazer as requisições
const { expect } = require('chai');   // Importando o chai para as asserções
const app = require('../server');     // Importando a aplicação Express


describe('POST /api/avaliacao', function() {
  it('should create an evaluation for a court', async function() {
    const res = await request(app)
      .post('/api/avaliacao')
      .send({
        usuario_id: 1,
        quadra_nome: 'Quadra A',
        nota: 4.5,
        comentario: 'Muito boa, mas poderia ter mais iluminação.'
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Avaliação registrada com sucesso!');
  });
});
