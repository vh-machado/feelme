const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', register);

// Rota para login do usuário
router.post('/login', login);

module.exports = router;
