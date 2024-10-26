require('dotenv').config();
const axios = require('axios');

const UserMovie = require("../models/userMovie.model");
const Review = require("../models/review.model");

async function getReviewWithMovieDetails(req, review) {
  const movieId = review.userMovieId.movieId;
  const token = req.header('x-auth-token');
  const movieServiceUrl = `${process.env.MOVIE_SERVICE_URL}/api/movie/${movieId}`

  const movieData = await axios.get(movieServiceUrl, {
    headers: {
      'x-auth-token': token,
      accept: 'application/json'
    }
  }).then(({ data: movieResponse }) => movieResponse.data)

  return {
    _id: review._id,
    text: review.text,
    likes: review.likes,
    loggedAt: review.loggedAt,
    rewatch: review.rewatch,
    userMovie: {
      _id: review.userMovieId._id,
      movie: {
        id: movieId,
        backdropPath: movieData.backdrop_path,
        title: movieData.title,
        overview: movieData.overview,
        posterPath: movieData.poster_path,
        genreIds: movieData.genre_ids,
        releaseDate: movieData.release_date
      },
      user: {
        _id: review.userMovieId.userId._id,
        name: review.userMovieId.userId.name,
        nickname: review.userMovieId.userId.nickname,
        email: review.userMovieId.userId.email
      },
    },
  }
}

async function setReviewTextEmotions(req, review) {
  const token = req.header('x-auth-token');
  const emotionServiceUrl = `${process.env.EMOTION_SERVICE_URL}/api/emotion-analysis`

  try {
    await axios.post(emotionServiceUrl, {
      reviewId: review._id,
      reviewText: review.text
    }, {
      headers: {
        'x-auth-token': token,
        accept: 'application/json'
      },
    })
  } catch(e) {
    console.log('Erro ao utilizar Emotion Analysis Service:', e)
  }
}

async function getReviewTextEmotions(req, reviewId) {
  const token = req.header('x-auth-token');
  const emotionServiceUrl = `${process.env.EMOTION_SERVICE_URL}/api/emotion-analysis/review/${reviewId}`

  let emotions = []

  try {
    await axios.get(emotionServiceUrl, {
      headers: {
        'x-auth-token': token,
        accept: 'application/json'
      },
    }).then(response => {
      if (response.status === 200) {
        emotions = response.data.emotions
      }
    }) 
  } catch(e) {
    console.log('Erro ao utilizar Emotion Analysis Service:', e)
  }

  return emotions
}

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate({
      path: "userMovieId",
      populate: { path: "userId", select: "name nickname email" }
    });

    const reviewWithMovieDetails = []
    
    for(const review of reviews) {
      let reviewDetailed = await getReviewWithMovieDetails(req, review)
      reviewDetailed['emotions'] = await getReviewTextEmotions(req, review._id)
      reviewWithMovieDetails.push(reviewDetailed)
    }
    res.status(200).json(reviewWithMovieDetails);
  } catch (err) {
    console.error("Erro ao buscar Critícas:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id).populate({
      path: "userMovieId",
      populate: { path: "userId", select: "name nickname email" }
    });

    let reviewWithMovieDetails = await getReviewWithMovieDetails(req, review)
    reviewWithMovieDetails['emotions'] = await getReviewTextEmotions(req, review._id)

    res.status(200).json(reviewWithMovieDetails);
  } catch (err) {
    console.error("Erro ao buscar Review:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.saveReview = async (req, res) => {
  const { id, userId, movieId , text, likes, loggedAt, rewatch } = req.body;

  try {
    let userMovie = await UserMovie.findOne({ userId, movieId });

    if (!userMovie) {
      userMovie = new UserMovie({
        movieId,
        userId
      });
  
      await userMovie.save();
    }

    const review = new Review({
      id,
      userMovieId: userMovie._id,
      text,
      likes,
      loggedAt,
      rewatch
    });

    await review.save();

    setReviewTextEmotions(req, review)

    res.status(201).json(review);
  } catch (err) {
    console.error("Erro ao salvar Critíca:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { userMovieId, text, likes, loggedAt, rewatch } = req.body;

  try {
    let review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ msg: "Critíca não encontrada" });
    }

    review.userMovieId = userMovieId || review.userMovieId;
    review.text = text || review.text;
    review.likes = likes || review.likes;
    review.loggedAt = loggedAt || review.loggedAt;
    review.rewatch = rewatch !== undefined ? rewatch : review.rewatch;

    await review.save();
    res.status(200).json(review);
  } catch (err) {
    console.error("Erro ao atualizar Critíca:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ msg: "Critíca não encontrada" });
    }

    await review.deleteOne();
    res.status(200).json({ msg: "Critíca deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar Critíca:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
