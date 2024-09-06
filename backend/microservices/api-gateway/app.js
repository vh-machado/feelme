const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const app = express();

// Middleware para analisar JSON
app.use(express.json());


// Configuração do proxy para o serviço de autenticação
app.use('/auth-service', createProxyMiddleware({
    target: 'http://localhost:5001', // URL do serviço de autenticação
    pathRewrite: { '^/auth-service': '' }, // Remove o prefixo /auth-service
    changeOrigin: true, // Atualiza o host da origem
    logger: console, // Nível de log para depuração
    on: {
        proxyReq: fixRequestBody,
    },
    onProxyReq: (proxyReq, req, res) => {
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
        res.status(500).send('Erro ao encaminhar requisição: ' + err.mmessage);
    },
}));
// Configuração do proxy para o serviço de autenticação
app.use('/user-service', createProxyMiddleware({
    target: 'http://localhost:5002', // URL do serviço de autenticação
    pathRewrite: { '^/user-service': '' }, // Remove o prefixo /auth-service
    changeOrigin: true, // Atualiza o host da origem
    logger: console, // Nível de log para depuração
    on: {
        proxyReq: fixRequestBody,
    },
    onProxyReq: (proxyReq, req, res) => {
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
        res.status(500).send('Erro ao encaminhar requisição: ' + err.mmessage);
    },
}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor da API Gateway iniciado na porta: ${PORT}`);
});
