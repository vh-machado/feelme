const express = require('express');
const { emotionAnalysis, getEmotionAnalysisByReviewId, deleteEmotionAnalysisById, getAllEmotionAnalysisByUserId, getMoviesByPositiveEmotions  } = require("../controllers/emotionAnalysisController");
const router = express.Router();

router.post('/emotion-analysis', emotionAnalysis);
router.get('/emotion-analysis/review/:reviewId', getEmotionAnalysisByReviewId);
router.get('/emotion-analysis/user/:userId', getAllEmotionAnalysisByUserId); 
router.delete('/emotion-analysis/:id', deleteEmotionAnalysisById);
router.get('/emotion-analysis/user/:userId/movies', getMoviesByPositiveEmotions);

module.exports = router;
