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
  } catch (err) {
    console.error("Erro ao buscar Filmes na API TMDB:", err.message);
    res.status(500).send("Erro ao buscar filmes no TMDB");
  }
};

exports.getMovieById = async (req, res) => {
   
   try {
    const { movie_id } = req.params;

    const { language } = req.query;

    const languageParam = language || 'pt-BR'; 

   
    // URL da API TMDB
    const url = `https://api.themoviedb.org/3/movie/${movie_id}`;

    const params = {
      language: languageParam
    }

    const response = await axios.get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        accept: 'application/json'
      }
    });
    
    res.status(200).json({
      success: true,
      message: "Filme obtido com sucesso",
      data: response.data
    });
  } catch (err) {
    console.error("Erro ao buscar Filme na API TMDB:", err.message);
    res.status(500).send("Erro ao buscar filme no TMDB");
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
  } catch (err) {
    console.error("Erro ao buscar Filme(s) na API TMDB:", err.message);
    res.status(500).send("Erro ao buscar filme(s) no TMDB");
  }
};



