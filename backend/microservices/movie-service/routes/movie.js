const express = require('express');
const { getMovieById, getMoviesPopular,  getMovieBySearch, getMoviesTrending, discoverMoviesWithGenresAndKeywords} = require('../controllers/movieController');
const auth = require('../middlewares/auth')
const router = express.Router();

router.get('/movie/popular', auth, getMoviesPopular); 
router.get('/movie/:movie_id', auth, getMovieById); 
router.get('/search/movie', auth, getMovieBySearch);
router.get('/trending/movie/:time_window', auth, getMoviesTrending);
router.post('/movie/discover', auth, discoverMoviesWithGenresAndKeywords);
module.exports = router;
