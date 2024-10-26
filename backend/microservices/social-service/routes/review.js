const express = require('express');
const { getReviews, getReviewById, saveReview, updateReview, deleteReview} = require('../controllers/reviewController');
const router = express.Router();

router.get('/reviews', getReviews);
router.get('/review/:id', getReviewById);
router.post('/review', saveReview);
router.put('/review/:id', updateReview);
router.delete('/review/:id', deleteReview);

module.exports = router;
