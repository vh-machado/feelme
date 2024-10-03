const mongoose = require("mongoose");
const Review = require("../../review-service/models/review.model");

const EmotionAnalysisSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  idReview: {
    type: Review.Schema.Types.ObjectId,
    ref: "Review",
  },
  emotions: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("EmotionAnalysis", EmotionAnalysisSchema);