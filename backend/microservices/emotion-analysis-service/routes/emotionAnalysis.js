const express = require('express');
const { emotionAnalysis, getEmotionAnalysisByReviewId, deleteEmotionAnalysisById, getAllEmotionAnalysisByUserId } = require("../controllers/emotionAnalysisController");
const router = express.Router();

router.post('/emotion-analysis', emotionAnalysis);
router.get('/emotion-analysis/review/:reviewId', getEmotionAnalysisByReviewId);
router.get('/emotion-analysis/user/:userId', getAllEmotionAnalysisByUserId); // Nova rota para buscar análises por userId
router.delete('/emotion-analysis/:id', deleteEmotionAnalysisById);

module.exports = router;
