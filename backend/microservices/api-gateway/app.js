const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Configuração do proxy para o serviço de autenticação
app.use('/auth-service', createProxyMiddleware({
    target: 'http://localhost:5001', // URL do serviço de autenticação
    pathRewrite: { '^/auth-service': '' }, // Remove o prefixo /auth-service
    changeOrigin: true, // Atualiza o host da origem
    logLevel: 'debug', // Nível de log para depuração
    onProxyReq: (proxyReq, req, res) => {
        console.log('Requisição encaminhada para:', 'http://localhost:5001' + req.url);
        console.log('Método:', req.method);
        console.log('Caminho:', req.url);
        console.log('Headers Originais:', req.headers);
        console.log('Corpo da Requisição:', req.body);

        // Certifique-se de que o corpo da requisição é transmitido
        if (req.body && req.method !== 'GET') {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
            proxyReq.end(); // Finaliza a escrita do corpo
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('Resposta do Servidor de Destino:', {
            statusCode: proxyRes.statusCode,
            headers: proxyRes.headers
        });
        proxyRes.pipe(res); // Encaminha a resposta do servidor de destino para o cliente
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
