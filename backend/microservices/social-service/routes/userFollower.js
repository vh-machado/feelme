const express = require('express');
const {
  getAllUserFollowers,
  getUserFollowersById,
  createUserFollower,
  deleteUserFollower,
  getFollowersByUserId,
  getReviewsFromFollowedUsers,
} = require('../controllers/userFollowerController');

const router = express.Router();

router.get('/userFollowers', getAllUserFollowers);
router.get('/userFollower/:id', getUserFollowersById);
router.post('/userFollower', createUserFollower);
router.delete('/userFollower/:id', deleteUserFollower);
router.get('/userFollowers/:userId', getFollowersByUserId);
router.get('/userFollowers/reviews/:userId', getReviewsFromFollowedUsers);


module.exports = router;