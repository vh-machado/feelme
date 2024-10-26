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
app.use('', require('./routes/user'));
app.use('', require('./routes/review'));
app.use('', require('./routes/userMovie'));
app.use('', require('./routes/userLike'));


// Porta do serviço
const PORT = process.env.PORT || 5002;

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
    const serviceUrl = `http://${host}:${PORT}/api/social`;
    console.log(`URL de requisição para o serviço de usuários: ${serviceUrl}`);
    console.log(`Servidor iniciado na porta: ${PORT}`);
});
