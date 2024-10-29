const express = require('express');
const {
  getUserMovies,
  getAllUserReviews,
  getUserReviewsByMovie,
  saveUserMovie,
  updateUserMovie,
  deleteUserMovie,
  checkUserMovie,
  getAllMoviesByUser
} = require('../controllers/userMovieController');
const router = express.Router();

router.get('/userMovie/reviews/:userId', getAllUserReviews);
router.get('/userMovie/reviews/:userId/:movieId', getUserReviewsByMovie);
router.get('/userMovie/movies/user/:userId', getAllMoviesByUser);
router.get('/userMovies', getUserMovies);
router.post('/userMovie', saveUserMovie);
router.put('/userMovie/:id', updateUserMovie);
router.delete('/userMovie/:id', deleteUserMovie);
router.get('/userMovie/check/:userId/:movieId', checkUserMovie);

module.exports = router;
