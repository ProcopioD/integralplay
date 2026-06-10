const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');  // Certifique-se de que o caminho do arquivo está correto

describe('Rota de Plataformas (Quadras)', function() {

  // Teste para listar todas as quadras
  it('should return a list of all available courts', async function() {
    const res = await request(app)
      .get('/plataformas');  // A URL para consultar todas as quadras

    expect(res.status).to.equal(200);  // Verifica se o status é 200 (OK)
    expect(res.body).to.be.an('array');  // Verifica se a resposta é um array
    expect(res.body[0]).to.have.property('nome');  // Verifica se a quadra tem o nome
    expect(res.body[0]).to.have.property('localizacao');  // Verifica se a quadra tem a localização
  });

  // Teste para filtrar quadras por localizacao e precoMaximo
  it('should return filtered courts by location and max price', async function() {
    const res = await request(app)
      .get('/plataformas/filtro?localizacao=Centro&precoMaximo=60');  // Filtrando por localização e preço máximo

    expect(res.status).to.equal(200);  // Verifica se o status é 200 (OK)
    expect(res.body).to.be.an('array');  // Verifica se a resposta é um array
    expect(res.body[0].localizacao).to.equal('Centro');  // Verifica se a quadra filtrada é do Centro
    expect(parseFloat(res.body[0].preco.replace('R$ ', '').replace(',', '.'))).to.be.at.most(60);  // Verifica se o preço é menor ou igual a 60
  });

});
