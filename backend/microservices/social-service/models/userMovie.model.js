const mongoose = require("mongoose");
const User = require("./user.model");
const Movie = require("../../movie-service/models/movie.model").default;

const UserMovieSchema = new mongoose.Schema({
  idMovie: {
    type: Number,
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
