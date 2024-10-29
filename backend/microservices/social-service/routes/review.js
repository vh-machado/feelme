const express = require('express');
const {getReviews, getReviewById, saveReview, updateReview, deleteReview, getReviewsByUserId} = require('../controllers/reviewController');
const router = express.Router();

router.get('/reviews', getReviews);
router.get('/review/:id', getReviewById);
router.post('/review', saveReview);
router.put('/review/:id', updateReview);
router.delete('/review/:id', deleteReview);
router.get('/reviews/user/:userId', getReviewsByUserId);

module.exports = router;
