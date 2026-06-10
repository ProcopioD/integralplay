const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');  // Certifique-se de que o caminho do arquivo está correto

describe('POST /usuarios/cadastro', function() {
  it('should return status 200 for valid user registration', async function() {
    const res = await request(app)
      .post('/usuarios/cadastro')
      .send({
        nome: 'Maria Souza',
        email: 'maria@exemplo.com',
        senha: 'senha123',
        telefone: '+55 (11) 98765-4321',
        nascimento: '1985-08-15',
        endereco: 'Rua Exemplo, 123',
        regiao: 'Sul',
        genero: 'Feminino',
        noticias: 'Quadras Novas, Eventos'
      });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Usuário cadastrado com sucesso!');
  });
});

describe('GET /usuarios/:email', function() {
  it('should return user details for the given email', async function() {
    const res = await request(app)
      .get('/usuarios/maria@exemplo.com'); // Substitua com o e-mail do usuário cadastrado

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nome');
    expect(res.body).to.have.property('email');
  });
});
