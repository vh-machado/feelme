const express = require('express');
const { emotionAnalysis } = require('../controllers/emotionAnalysisController');

const router = express.Router();

router.post('/emotion-analysis', emotionAnalysis);

module.exports = router;
