const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Middleware para logar detalhes da requisição antes de ativar o proxy
app.use('/auth-service', (req, res, next) => {
    console.log('--- Detalhes da Requisição Recebida ---');
    console.log('Método:', req.method);
    console.log('Caminho:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Corpo:', req.body);
    console.log('--------------------------------------');
    next(); // Passa para o próximo middleware (o proxy)
});

// Configuração do proxy para o serviço de autenticação
app.use('/auth-service', createProxyMiddleware({
    target: 'http://localhost:5001', // URL do serviço de autenticação
    pathRewrite: { '^/auth-service': '' }, // Remove o prefixo /auth-service
    changeOrigin: true, // Atualiza o host da origem
    logger: console, // Nível de log para depuração
    onProxyReq: (proxyReq, req, res) => {
        console.log('Requisição encaminhada para:', 'http://localhost:5001' + req.url);
        console.log('Método:', req.method);
        console.log('Caminho:', req.url);
        console.log('Headers Originais:', req.headers);
        console.log('Corpo da Requisição:', req.body);
        if (req.body && req.method !== 'GET') {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
            proxyReq.end(); 
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('Resposta do Servidor de Destino:', {
            statusCode: proxyRes.statusCode,
            headers: proxyRes.headers
        });
        proxyRes.pipe(res); 
    },
    onError: (err, req, res) => {
        console.error('Erro ao encaminhar requisição:', err.message);
        res.status(500).send('Erro ao encaminhar requisição');
    },
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor da API Gateway iniciado na porta: ${PORT}`);
});
