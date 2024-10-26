const express = require('express');
const { 
  getAllUserLikes, 
  getUserLikeById, 
  createUserLike, 
  updateUserLike,
  checkUserLikeExists, 
  deleteUserLike,
  deleteUserLikeByReview
} = require('../controllers/userLikeController');

const router = express.Router();

router.get('/userLikes', getAllUserLikes);
router.get('/userLike/:id', getUserLikeById);
router.post('/userLike', createUserLike);
router.get('/userLike/exists/:userId/:reviewId', checkUserLikeExists);
router.put('/userLike/:id', updateUserLike);
router.delete('/userLike/:id', deleteUserLike);
router.delete('/userLike/review/:reviewId', deleteUserLikeByReview);

module.exports = router;
