const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');

describe('POST /reservas', function() {
  it('should create a new reservation', async function() {
    const res = await request(app)
      .post('/reservas')
      .send({
        usuario_id: 1,  // ID do usuário, certifique-se de que existe no banco
        quadra_nome: 'Quadra A',
        data: '2023-06-01',
        horario_inicio: '10:00',
        horario_fim: '12:00'
      });

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('Reserva realizada com sucesso!');
  });
});

describe('GET /reservas/:usuario_id', function() {
  it('should return reservations for the specified user', async function() {
    const res = await request(app)
      .get('/reservas/1'); // Substitua pelo ID do usuário

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('usuario_id');
  });
});

