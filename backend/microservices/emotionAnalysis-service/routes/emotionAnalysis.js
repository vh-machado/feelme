const express = require('express');
const { emotionAnalysis } = require('../controllers/emotionAnalysisController');

const router = express.Router();


router.post('/emotionAnalysis', emotionAnalysis);

module.exports = router;
