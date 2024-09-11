const mongoose = require("mongoose");
const UserMovie = require("../../userMovie-service/models/userMovie.model");

const ReviewSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  idUserMovie: {
    type: UserMovie.Schema.Types.ObjectId,
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
