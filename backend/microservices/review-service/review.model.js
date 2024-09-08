const mongoose = require('mongoose');
const UserMovie = require('../userMovie-service/userMovie.model');

// Definindo o esquema para a solicitação de folga
const reviewSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  idUserMovie: {
    type: UserMovie.Schema.Types.ObjectId,
    ref: UserMovie
  },
  text: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  }
});

// Criando o model com base no esquema
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
