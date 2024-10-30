const axios = require('axios');

exports.getMoviesPopular = async (req, res) => {
  try {
    const { language, page } = req.query;
    const languageParam = language || 'pt-BR';
    const pageParam = page || 1;

    // URL da API TMDB
    const url = `https://api.themoviedb.org/3/movie/popular`;


    const params = {
      language: languageParam,
      page: pageParam,
    };


    const response = await axios.get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: 'application/json'
      }
    });

    res.status(200).json({
      success: true,
      message: "Filmes populares obtidos com sucesso",
      data: response.data
    });
  } catch (error) {
    if (error.response) {
      console.error('Erro no TMDB:', error.response.status, error.response.data);

      // Responder com o erro retornado pelo TMDB
      res.status(error.response.status).json({
        success: false,
        message: 'Erro ao buscar filmes no TMDB',
        error: error.response.data
      });

    } else if (error.request) {
      console.error('Nenhuma resposta do TMDB:', error.request);

      res.status(500).json({
        success: false,
        message: 'Nenhuma resposta da API do TMDB. Por favor, tente novamente.',
      });

    } else {
      console.error('Erro ao configurar a requisição:', error.message);

      res.status(500).json({
        success: false,
        message: 'Erro ao configurar a requisição. Por favor, tente novamente.',
        error: error.message
      });
    }
  }
};

exports.getMoviesTrending = async (req, res) => {
  try {
    const { language } = req.query;
    const { time_window } = req.params || 'week';
    const languageParam = language || 'pt-BR';

    // URL da API TMDB
    const url = `https://api.themoviedb.org/3/trending/movie/${time_window}`;

    const params = {
      language: languageParam,
    };


    const response = await axios.get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: 'application/json'
      }
    });

    res.status(200).json({
      success: true,
      message: "Filmes obtidos com sucesso",
      data: response.data
    });
  } catch (error) {
    if (error.response) {
      console.error('Erro no TMDB:', error.response.status, error.response.data);

      // Responder com o erro retornado pelo TMDB
      res.status(error.response.status).json({
        success: false,
        message: 'Erro ao buscar filmes no TMDB',
        error: error.response.data
      });

    } else if (error.request) {
      console.error('Nenhuma resposta do TMDB:', error.request);

      res.status(500).json({
        success: false,
        message: 'Nenhuma resposta da API do TMDB. Por favor, tente novamente.',
      });

    } else {
      console.error('Erro ao configurar a requisição:', error.message);

      res.status(500).json({
        success: false,
        message: 'Erro ao configurar a requisição. Por favor, tente novamente.',
        error: error.message
      });
    }
  }
};

exports.findMovieById = async (movie_id, language) => {
  const languageParam = language || 'pt-BR';

  const url = `https://api.themoviedb.org/3/movie/${movie_id}`;

  const params = { language: languageParam };

  const response = await axios.get(url, {
    params,
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      accept: 'application/json',
    },
  });

  return response
}

exports.getMovieById = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const { language } = req.query;

    const response = await this.findMovieById(movie_id, language)

    res.status(200).json({
      success: true,
      message: "Filme obtido com sucesso",
      data: response.data
    });
  } catch (error) {
    let errorMessage = ""

    if (error.response) {
      errorMessage = 'Erro no TMDB'
      console.error(errorMessage, error.response.status, error.response.data)
    } else if (error.request) {
      errorMessage = 'Nenhuma resposta do TMDB'
      console.error(errorMessage, error.request)
    } else {
      errorMessage = 'Erro ao configurar a requisição'
      console.error(errorMessage, error.message)
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMovieBySearch = async (req, res) => {
  try {
    const { query, include_adult, language, page } = req.query;
    const queryParam = query || '';
    const include_adultParam = include_adult || false;
    const languageParam = language || 'pt-BR';
    const pageParam = page || 1;


    // URL da API TMDB
    const url = `https://api.themoviedb.org/3/search/movie`;

    const params = {
      query: queryParam,
      include_adult: include_adultParam,
      language: languageParam,
      page: pageParam,
    };


    const response = await axios.get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`, // Use o token da API do TMDB
        accept: 'application/json'
      }
    });

    res.status(200).json({
      success: true,
      message: "Filme(s) pesquisado(s) obtidos com sucesso",
      data: response.data
    });
  } catch (error) {
    if (error.response) {
      console.error('Erro no TMDB:', error.response.status, error.response.data);

      // Responder com o erro retornado pelo TMDB
      res.status(error.response.status).json({
        success: false,
        message: 'Erro ao buscar filmes no TMDB',
        error: error.response.data
      });

    } else if (error.request) {
      console.error('Nenhuma resposta do TMDB:', error.request);

      res.status(500).json({
        success: false,
        message: 'Nenhuma resposta da API do TMDB. Por favor, tente novamente.',
      });

    } else {
      console.error('Erro ao configurar a requisição:', error.message);

      res.status(500).json({
        success: false,
        message: 'Erro ao configurar a requisição. Por favor, tente novamente.',
        error: error.message
      });
    }
  }
};

exports.getKeywordsByMovieIds = async (req, res) => {
  const { movieIds } = req.body;

  try {

    let allKeywords = new Set();


    for (const movieId of movieIds) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/keywords`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: 'application/json'
        }
      });

      response.data.keywords.forEach(keyword => allKeywords.add(keyword.name));
    }

    res.status(200).json({
      success: true,
      message: "Keywords obtidas com sucesso",
      keywords: Array.from(allKeywords)
    });

  } catch (error) {
    console.error('Erro ao buscar keywords:', error.message);

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar keywords dos filmes. Por favor, tente novamente.',
      error: error.message
    });
  }
};



async function getGenresByMovieIds(movieIds) {
  const genreIds = new Set();

  for (const movieId of movieIds) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: 'application/json',
        },
      });

      response.data.genres.forEach((genre) => genreIds.add(genre.id));
    } catch (error) {
      console.error(`Erro ao buscar gêneros para o filme ${movieId}:`, error.message);
      throw error;
    }
  }

  return Array.from(genreIds);
}


async function getKeywordsByMovieIds(movieIds) {
  let allKeywords = new Set();

  for (const movieId of movieIds) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/keywords`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: 'application/json',
        },
      });

  

      response.data.keywords.forEach(keyword => allKeywords.add(keyword.id));
    } catch (error) {
      console.error(`Erro ao buscar keywords para o filme ${movieId}:`, error.message);
      throw error;
    }
  }

  return Array.from(allKeywords);
}

exports.discoverMoviesWithGenresAndKeywords = async (req, res) => {
  const { movieIds, language, page } = req.body;
  const languageParam = language || 'pt-BR';
  const pageParam = page || 1;

  try {
    const keywords = await getKeywordsByMovieIds(movieIds);
    const genres = await getGenresByMovieIds(movieIds);

    const withKeywords = keywords.join('|');
    const withGenres = genres.join('|');

    const url = `https://api.themoviedb.org/3/discover/movie`;

    const response = await axios.get(url, {
      params: {
        with_keywords: withKeywords,
        with_genres: withGenres,
        language: languageParam,
        page: pageParam,
      },
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: 'application/json',
      },
    });

    let discoveredMovies = response.data.results.filter(movie => !movieIds.includes(movie.id))

    res.status(200).json({
      success: true,
      message: "Filmes obtidos com filtragem de gêneros e keywords específicos",
      data: discoveredMovies,
    });
  } catch (error) {
    console.error("Erro ao buscar filmes com filtagem de gêneros e keywords:", error.message);

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar filmes. Por favor, tente novamente.',
      error: error.message,
    });
  }
};
