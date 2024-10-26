require('dotenv').config();
const express = require('express');
const app = express();
const os = require('os');



// Middleware para analisar JSON
app.use(express.json({ extended: false }));

// Definir rotas
app.use('/api', require('./routes/movie'));


// Porta do serviço
const PORT = process.env.PORT || 5003;

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
    const serviceUrl = `http://${host}:${PORT}/api`;
    console.log(`URL de requisição para o serviço de filmes: ${serviceUrl}/movie`);
    console.log(`Servidor iniciado na porta: ${PORT}`);
});
