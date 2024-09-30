const express = require('express');
const { getMovieById, getMoviesPopular,  getMovieBySearch} = require('../controllers/movieController');
const auth = require('../middlewares/auth')
const router = express.Router();

router.get('/movie/popular', auth, getMoviesPopular); 
router.get('/movie/:movie_id', auth, getMovieById); 
router.get('/search/movie', auth, getMovieBySearch);

module.exports = router;
