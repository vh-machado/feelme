require('dotenv').config();
const axios = require('axios');

const UserMovie = require("../models/userMovie.model");
const User = require("../models/user.model");

exports.getAllUserReviews = async (req, res) => {

  const { userId } = req.params;

  try {
    const userMovies = await UserMovie.find({ idUser: userId }).populate("idMovie", "id").exec();

    const userMovieIds = userMovies.map(userMovie => userMovie._id);

    const reviews = await Review.find({ idUserMovie: { $in: userMovieIds } })
      .populate({
        path: 'idUserMovie',
        populate: { path: "idMovie", select: "id" }
      })
      .exec();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'Nenhuma review encontrada para este usuário.' });
    }
    res.status(200).json(reviews);

  } catch (err) {
    console.error("Erro ao buscar reviews do user:", err.message);
    res.status(500).send("Erro ao buscar reviews");
  }
};

exports.getUserReviewsByMovie = async (req, res) => {

  const { userId, movieId } = req.params;

  try {
    const userMovie = await UserMovie.findOne({ usuario: userId, filme: movieId });

    if (!userMovie) {
      return res.status(404).json({ message: "Nenhuma associação encontrada entre o usuário e o filme." });
    }

    const reviews = await Review.find({ idUserMovie: userMovie.id })
      .populate({
        path: 'idUserMovie',
        populate: { path: "idMovie", select: "id" }
      })
      .exec();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "Nenhuma review encontrada para este usuário neste filme." });
    }
    res.status(200).json(reviews);

  } catch (err) {
    console.error("Erro ao buscar reviews do user:", err.message);
    res.status(500).send("Erro ao buscar reviews");
  }
};

exports.getUserMovies = async (res) => {
  try {
    const userMovies = await UserMovie.find()
      .populate("idMovie")
      .populate("idUser");
    res.status(200).json(userMovies);
  } catch (err) {
    console.error("Erro ao buscar UserMovies:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.saveUserMovie = async (req, res) => {
  const { idMovie, idUser, loggedAt, rewatch } = req.body;

  try {
    const token = req.header('x-auth-token');
    const movieServiceUrl = `${process.env.MOVIE_SERVICE_URL}/api/movie/${idMovie}`

    const movie = await axios.get(movieServiceUrl, {
      headers: {
        'x-auth-token': token,
        accept: 'application/json'
      }
    }).then(({ data: movieResponse }) => movieResponse.data)

    const user = await User.findById(idUser);

    if (!movie) {
      return res.status(404).json({ msg: "Filme não encontrado" });
    }
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const userMovie = new UserMovie({
      idMovie,
      idUser,
      loggedAt,
      rewatch,
    });

    await userMovie.save();
    res.status(201).json(userMovie);
  } catch (err) {
    console.error("Erro ao criar UserMovie:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.updateUserMovie = async (req, res) => {
  const { id } = req.params;
  const { idMovie, idUser, loggedAt, rewatch } = req.body;

  try {
    let userMovie = await UserMovie.findById(id);

    if (!userMovie) {
      return res.status(404).json({ msg: "UserMovie não encontrado" });
    }

    userMovie.idMovie = idMovie || userMovie.idMovie;
    userMovie.idUser = idUser || userMovie.idUser;
    userMovie.loggedAt = loggedAt || userMovie.loggedAt;
    userMovie.rewatch = rewatch !== undefined ? rewatch : userMovie.rewatch;

    await userMovie.save();
    res.status(200).json(userMovie);
  } catch (err) {
    console.error("Erro ao atualizar UserMovie:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.deleteUserMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const userMovie = await UserMovie.findById(id);

    if (!userMovie) {
      return res.status(404).json({ msg: "UserMovie não encontrado" });
    }

    await userMovie.remove();
    res.status(200).json({ msg: "UserMovie deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar UserMovie:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
