require('dotenv').config();
const conectarMongoDB = require('./models/mongodb');
conectarMongoDB();

const express = require('express');
const cors = require('cors'); // ◄ CHAMANDO O CORS AQUI
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const db = require('./models/db');

const app = express();

// ─── CONFIGURAÇÃO DO CORS ─────────────────────────────────────────────────────
// Isso permite que o frontend na Vercel envie requisições para cá sem ser bloqueado
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;

// ─── SOCKET.IO ────────────────────────────────────────────────────────────────
const configurarSocket = require('./config/socketConfig');
configurarSocket(io);

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log('Pasta public:', require('path').join(__dirname, 'public'));

// ─── ROTAS ────────────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes');
const userRoutes        = require('./routes/userRoutes');
const reservaRoutes     = require('./routes/reservaRoutes');
const pagamentoRoutes   = require('./routes/pagamentoRoutes');
const avaliacaoRoutes   = require('./routes/avaliacaoRoutes');
const historicoRoutes   = require('./routes/historicoRoutes');
const espacoRoutes      = require('./routes/espacoRoutes');
const quadraRoutes      = require('./routes/quadraRoutes');
const logRoutes         = require('./routes/logRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');
const chatRoutes        = require('./routes/chatRoutes');
const adminRoutes       = require('./routes/adminRoutes');


// ─── HEALTHCHECK (Para o Docker monitorar) ────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.use('/auth',          authRoutes);
app.use('/usuarios',      userRoutes);
app.use('/reservas',      reservaRoutes);
app.use('/pagamentos',    pagamentoRoutes);
app.use('/avaliacoes',    avaliacaoRoutes);
app.use('/historico',     historicoRoutes);
app.use('/espacos',       espacoRoutes);
app.use('/quadras',       quadraRoutes);
app.use('/logs',          logRoutes);
app.use('/notificacoes',  notificacaoRoutes);
app.use('/chat',          chatRoutes);
app.use('/admin',         adminRoutes);

// ─── INICIA O SERVIDOR ────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});