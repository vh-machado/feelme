const mongoose = require("mongoose");
const UserFollowersSchema = new mongoose.Schema({
  userIdFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userIdTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("UserFollowers", UserFollowersSchema);
