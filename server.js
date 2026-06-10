const db = require('./models/db'); // Conexão com o banco

require('dotenv').config(); // Carregar variáveis de ambiente
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
const userRoutes = require('./routes/userRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const apiCentralRoutes = require('./routes/apiCentralRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');  // Nova rota de pagamento
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');  // Nova rota de avaliação
const historicoRoutes = require('./routes/historicoRoutes'); // Nova rota de histórico

app.use('/usuarios', userRoutes);
app.use('/reservas', reservaRoutes);
app.use('/plataformas', apiCentralRoutes);
app.use('/api', apiCentralRoutes);
app.use('/api', pagamentoRoutes);  // Usar rota de pagamento
app.use('/api', avaliacaoRoutes);  // Usar rota de avaliação
app.use('/api/historico', historicoRoutes); // Usar rota de histórico


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
