const express = require('express');
const { 
  getAllUserLikes, 
  getUserLikeById, 
  createUserLike, 
  updateUserLike,
  checkUserLikeExists, 
  deleteUserLike
} = require('../controllers/userLikeController');

const router = express.Router();

router.get('/userLikes', getAllUserLikes);
router.get('/userLike/:id', getUserLikeById);
router.post('/userLike', createUserLike);
router.get('/userLike/exists/:idUser/:idReview', checkUserLikeExists);
router.put('/userLike/:id', updateUserLike);
router.delete('/userLike/:id', deleteUserLike);

module.exports = router;
