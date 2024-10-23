const Movie = require("../models/movie.model");
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

const fetchMovieById = async (movieId, language) => {
  const languageParam = language || 'pt-BR';

  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}`;

    const params = { language : languageParam };

    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: 'application/json',
      },
    });

    return response.data;  // Retorna os dados do filme
  } catch (error) {
    // Tratar erros do TMDB
    if (error.response) {
      console.error('Erro no TMDB:', error.response.status, error.response.data);
      throw new Error(`Erro TMDB: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      console.error('Nenhuma resposta do TMDB:', error.request);
      throw new Error('Nenhuma resposta do TMDB.');
    } else {
      console.error('Erro ao configurar a requisição:', error.message);
      throw new Error('Erro ao configurar a requisição.');
    }
  }
};

exports.getMovieById = async (req, res) => {
   
   try {
    const { movie_id } = req.params;

    const { language } = req.query;
   
    const movieData = await fetchMovieById(movie_id, language);
    
    res.status(200).json({
      success: true,
      message: "Filme obtido com sucesso",
      data: movieData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMovieBySearch = async (req, res) => {
  try {
    const {query, include_adult, language, page } = req.query;
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



