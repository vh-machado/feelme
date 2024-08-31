// api-gateway/routes/auth.js
const express = require('express');
const router = express.Router();

// Defina as rotas necessárias para o serviço de autenticação
router.get('/users', (req, res) => {
    res.send('Essa rota está sendo gerenciada pela API Gateway');
});

module.exports = router;
