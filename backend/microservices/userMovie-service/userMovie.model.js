const mongoose = require('mongoose');
const User = require('../user-service/user.model');
const Movie = require('../movie-service/movie.model');

// Definindo o esquema para a solicitação de folga
const userMovieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  idMovie: {
    type: Movie.Schema.Types.ObjectId,
    ref: Movie
  },
  idUser: {
    type: User.Schema.Types.ObjectId,
    ref: User
  },
  loggedAt: {
    type: Date,
    required: true
  },
  rewatch: {
    type: Boolean,
    required: true
  }
});

// Criando o model com base no esquema
const UserMovie = mongoose.model('UserMovie', UserMovieSchema);

module.exports = UserMovie;
