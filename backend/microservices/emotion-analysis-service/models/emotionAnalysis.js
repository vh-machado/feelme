const mongoose = require("mongoose");

const EmotionAnalysisSchema = new mongoose.Schema({
  idReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },
  emotions: [
    {
      emoji: { type: String, required: true }, 
      description: { type: String, required: true },
      _id: false
    }
  ]
});

module.exports = mongoose.model("EmotionAnalysis", EmotionAnalysisSchema);

