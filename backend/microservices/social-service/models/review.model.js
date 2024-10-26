const mongoose = require("mongoose");
const UserMovie = require("./userMovie.model");

const ReviewSchema = new mongoose.Schema({
  userMovieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserMovie",
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    required: true,
  },
  loggedAt: {
    type: Date,
    required: true,
  },
  rewatch: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
