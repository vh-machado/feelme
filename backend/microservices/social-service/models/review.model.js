const mongoose = require("mongoose");
const UserMovie = require("./userMovie.model");

const ReviewSchema = new mongoose.Schema({
  idUserMovie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserMovie",
  },
  text: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
