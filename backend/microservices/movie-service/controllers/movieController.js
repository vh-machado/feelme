const Movie = require("../models/movie.model");

exports.getMovies = async (res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error("Erro ao buscar Filmes:", err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.saveMovie = async (req, res) => {
  const { id } = req.body;

  try {
    const movie = new Movie({ id });

    await movie.save();
    res.status(201).json({ msg: "Filme cadastrado com sucesso!" });
  } catch (err) {
    console.error(
      "Erro no servidor durante o salvamento de Filme:",
      err.message
    );
    res.status(500).send("Erro no servidor");
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    let movie = await Movie.findOne({ id });

    movie = new Movie({ id });

    if (!movie) {
      return res.status(404).json({ msg: "Filme não encontrado para deleção" });
    }

    await movie.delete();
    await movie.remove();
    res.status(200).json({ msg: "Filme deletado com sucesso!" });
  } catch (err) {
    console.error("Erro no servidor durante a deleção de Filme:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
