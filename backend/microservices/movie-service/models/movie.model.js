const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Movie", MovieSchema);
