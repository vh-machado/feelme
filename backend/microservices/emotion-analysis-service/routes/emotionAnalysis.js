const express = require('express');
const { emotionAnalysis, getEmotionAnalysisByIdReview, deleteEmotionAnalysisById } = require("../controllers/emotionAnalysisController");
const router = express.Router();

router.post('/emotion-analysis', emotionAnalysis);
router.get('/emotion-analysis/review/:idReview', getEmotionAnalysisByIdReview);
router.delete('/emotion-analysis/:id', deleteEmotionAnalysisById);


module.exports = router;
