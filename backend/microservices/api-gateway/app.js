require('dotenv').config();
const express = require('express');
const http = require('http')
const https = require('https')
const cors = require('cors');
const fs = require('fs')
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const app = express();

// Middleware para analisar JSON
app.use(express.json());

const corsOptions = {
    origin: process.env.ORIGIN_FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
};

app.use(cors(corsOptions));


app.use('/auth-service', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL, // URL do serviço de autenticação
    pathRewrite: { '^/auth-service': '' }, // Remove o prefixo /auth-service
    changeOrigin: true,
    logger: console,
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

app.use('/social-service', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL, // URL do serviço de autenticação
    pathRewrite: { '^/social-service': '' }, // Remove o prefixo /auth-service
    changeOrigin: true,
    logger: console,
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

app.use('/movie-service', createProxyMiddleware({
    target: process.env.MOVIE_SERVICE_URL, // URL do serviço de autenticação
    pathRewrite: { '^/movie-service': '' }, // Remove o prefixo /auth-service
    changeOrigin: true,
    logger: console,
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



// Porta do serviço
const HTTPPORT = process.env.HTTPPORT
const HTTPSPORT = process.env.HTTPSPORT

http.createServer(app).listen(HTTPPORT, () => {
    console.log(`HTTP Server is running on http://localhost:${HTTPPORT}`)
})

const credentials = {
    key: fs.readFileSync('./ssl/private.key'),
    cert: fs.readFileSync('./ssl/certificate.crt'),
    bundle: fs.readFileSync('./ssl/ca_bundle.crt')
}

https.createServer(credentials, app).listen(HTTPSPORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${HTTPSPORT}`)
})