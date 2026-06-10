const axios = require('axios');

module.exports = {
  async coletarDadosPlataformas(req, res) {
    try {
      // Simulando a consulta de 2 APIs externas de quadras
      const plataformas = [
        'https://api.plataforma1.com/quadras', // Exemplo fictício
        'https://api.plataforma2.com/quadras'  // Exemplo fictício
      ];

      const respostas = await Promise.all(plataformas.map(url => axios.get(url)));

      // Unifica todos os dados das plataformas em um único array
      const dadosUnificados = respostas.flatMap(resp => resp.data);

      // Retorna esses dados ao frontend
      res.json(dadosUnificados);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao acessar as APIs externas' });
    }
  }
};
