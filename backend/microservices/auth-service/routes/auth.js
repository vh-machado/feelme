const express = require('express');
const { register, login, getAllUsers } = require('../controllers/authController');
const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', register);

// Rota para login do usuário
router.post('/login', login);

// Rota para obter todos os usuários
router.get('/users', getAllUsers);

// Rota POST simples para teste
router.post('/simple-test', (req, res) => {
  console.log('Requisição POST recebida');
  res.status(200).send('POST bem-sucedido');
});

module.exports = router;
