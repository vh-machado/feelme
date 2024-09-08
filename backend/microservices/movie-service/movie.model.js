const mongoose = require('mongoose');

// Definindo o esquema para a solicitação de folga
const movieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  }
});

// Criando o model com base no esquema
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
