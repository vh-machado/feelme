const mongoose = require("mongoose");
const UserLikeSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  idReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  }
});

module.exports = mongoose.model("UserLike", UserLikeSchema);
