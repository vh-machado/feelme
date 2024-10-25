require('dotenv').config();
const axios = require('axios');

const UserMovie = require("../models/userMovie.model");
const Review = require("../models/review.model");

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate({
      path: "idUserMovie",
      populate: { path: "idUser", select: "name nickname email" }
    });

    const customReviews = []

    for(const review of reviews) {
      const movieId = review.idUserMovie.idMovie;
      
      const token = req.header('x-auth-token');
      const movieServiceUrl = `${process.env.MOVIE_SERVICE_URL}/api/movie/${movieId}`

      const movieData = await axios.get(movieServiceUrl, {
        headers: {
          'x-auth-token': token,
          accept: 'application/json'
        }
      }).then(({ data: movieResponse }) => movieResponse.data)

      customReviews.push({
        _id: review._id,
        text: review.text,
        likes: review.likes,
        userMovie: {
          _id: review.idUserMovie._id,
          movie: {
            id: movieId,
            backdropPath: movieData.backdrop_path,
            title: movieData.title,
            overview: movieData.overview,
            posterPath: movieData.poster_path,
            genreIds: movieData.genre_ids,
            release_date: movieData.release_date
          },
          user: {
            _id: review.idUserMovie._id,
            name: review.idUserMovie.idUser.name,
            nickname: review.idUserMovie.idUser.nickname,
            email: review.idUserMovie.idUser.email
          },
          loggedAt: review.idUserMovie.loggedAt,
          rewatch: review.idUserMovie.rewatch,
        },
      }); 
    }
    res.status(200).json(customReviews);
  } catch (err) {
    console.error("Erro ao buscar Critícas:", err.message);
    res.status(500).send("Erro no servidor");
  }
};


exports.getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    res.status(200).json(review);
  } catch (err) {
    console.error("Erro ao buscar Review:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.saveReview = async (req, res) => {
  const { id, idUserMovie, text, likes } = req.body;

  try {
    const userMovie = await UserMovie.findById(idUserMovie);

    if (!userMovie) {
      return res.status(404).json({ msg: "Filme e usuário não encontrados" });
    }

    const review = new Review({
      id,
      idUserMovie,
      text,
      likes,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("Erro ao salvar Critíca:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { idUserMovie, text, likes } = req.body;

  try {
    let review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ msg: "Critíca não encontrada" });
    }

    review.idUserMovie = idUserMovie || review.idUserMovie;
    review.text = text || review.text;
    review.likes = likes || review.likes;

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
