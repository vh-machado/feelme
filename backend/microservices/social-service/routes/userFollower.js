const express = require('express');
const {
  getAllUserFollowers,
  getUserFollowersById,
  createUserFollower,
  deleteUserFollower,
  getFollowersByUserId,
} = require('../controllers/userFollowerController');

const router = express.Router();

router.get('/userFollowers', getAllUserFollowers);
router.get('/userFollower/:id', getUserFollowersById);
router.post('/userFollower', createUserFollower);
router.delete('/userFollower/:id', deleteUserFollower);
router.get('/userFollowers/:userId', getFollowersByUserId);

module.exports = router;