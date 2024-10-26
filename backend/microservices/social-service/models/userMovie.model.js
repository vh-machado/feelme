const mongoose = require("mongoose");
const User = require("./user.model");
const Movie = require("../../movie-service/models/movie.model").default;

const UserMovieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
},{ strictPopulate: false });

module.exports = mongoose.model("UserMovie", UserMovieSchema);;
