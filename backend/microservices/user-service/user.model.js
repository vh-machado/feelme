const mongoose = require('mongoose');

// Definindo o esquema para a solicitação de folga
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Criando o model com base no esquema
const User = mongoose.model('User', UserSchema);

module.exports = User;
