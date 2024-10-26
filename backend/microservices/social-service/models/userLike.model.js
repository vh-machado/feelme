const mongoose = require("mongoose");
const UserLikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  }
});

module.exports = mongoose.model("UserLike", UserLikeSchema);
