const mongoose = require("mongoose");
const User = require("./user.model");
const Movie = require("../../movie-service/models/movie.model");

const UserMovieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  idMovie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loggedAt: {
    type: Date,
    required: true,
  },
  rewatch: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("UserMovie", UserMovieSchema);;
