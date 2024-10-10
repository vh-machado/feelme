const express = require('express');
const { getReviews, getReviewById, saveReview, updateReview, deleteReview} = require('../controllers/reviewController');
const router = express.Router();

router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewById);
router.post('/reviews', saveReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
