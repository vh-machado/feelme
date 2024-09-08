const mongoose = require('mongoose');
const Review = require('../review-service/review.model');

// Definindo o esquema para a solicitação de folga
const movieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  idReview: {
    type: Review.Schema.Types.ObjectId,
    ref: Review
  },
  emotions: {
    type: Array,
    required: true
  },
});

// Criando o model com base no esquema
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
