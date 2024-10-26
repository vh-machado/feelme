require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const app = express();
const os = require('os');


// Conectar ao MongoDB
connectDB();


// Middleware para analisar JSON
app.use(express.json({ extended: false }));

// Definir rotas
app.use('/api/auth', require('./routes/auth'));


// Porta do serviço
const PORT = process.env.PORT || 5001;

// Obter dinamicamente o hostname (localhost ou domínio)
const getHostName = () => {
    if (process.env.NODE_ENV === 'PRODUCAO') {
        return os.hostname(); // Retorna o hostname do servidor em produção
    }
    return 'localhost'; // Usar 'localhost' durante o desenvolvimento
};

// Iniciar o servidor
app.listen(PORT, () => {
    const host = getHostName();
    const serviceUrl = `http://${host}:${PORT}/api/auth`;
    console.log(`URL de requisição para o serviço de autenticação: ${serviceUrl}`);
    console.log(`Servidor iniciado na porta: ${PORT}`);
});


const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado, administrador necessário' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'O Token não é válido' });
  }
};

module.exports = adminMiddleware;
