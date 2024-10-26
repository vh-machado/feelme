const express = require('express');
const { emotionAnalysis, getEmotionAnalysisByReviewId, deleteEmotionAnalysisById } = require("../controllers/emotionAnalysisController");
const router = express.Router();

router.post('/emotion-analysis', emotionAnalysis);
router.get('/emotion-analysis/review/:reviewId', getEmotionAnalysisByReviewId);
router.delete('/emotion-analysis/:id', deleteEmotionAnalysisById);


module.exports = router;
