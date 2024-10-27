<template>
  <div v-if="movieDetails">
    <div class="relative mb-4">
      <img 
        :src="movieDetails.backdrop_path" 
        alt="Backdrop do Filme" 
        class="fixed-backdrop" 
      >
    </div>

    <div class="flex flex-col items-center gap-4 p-4">
      <div class="flex justify-between items-start w-full bg-gray bg-opacity-100 rounded-lg shadow-lg p-4">
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold">{{ movieDetails.title }}</h1>
          <p><strong>Produção:</strong> {{ movieDetails.production_companies.map(company => company.name).join(', ') }}</p>
          <div class="flex justify-between w-full">
            <p>
              <strong>Data de Lançamento:</strong> 
              {{ formatDate(movieDetails.release_date) }} | {{ movieDetails.runtime }} mins
            </p>
          </div>
          <p>
            <strong>Gêneros:</strong> 
            {{ movieDetails.genres.map(genre => genre.name).join(', ') }}
          </p>
          <p class="mt-2"> <strong>Sinopse:</strong> {{ movieDetails.overview }}</p>
          <p class="font-bold mt-2">Nota Média: {{ movieDetails.vote_average }}</p>
        </div>
        <img 
          :src="movieDetails.posterUrl" 
          alt="Poster do Filme" 
          class="w-64 h-auto rounded-lg ml-4" 
        >
      </div>

      <p class="italic text-gray-500 mt-4">“{{ movieDetails.tagline }}”</p>

      <div class="flex w-1/6 flex-col justify-center items-center gap-4 px-4">
        <UButton block type="submit" color="green" size="lg" class="font-semibold">
          Escrever crítica
        </UButton>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Carregando...</p>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieServiceFetch } from '~/composables/useMovieService';

interface MovieDetails {
  title: string
  overview: string
  release_date: string
  runtime: number
  vote_average: number
  genres: Array<{ id: number; name: string }>
  posterUrl: string
  backdrop_path: string
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>
  tagline: string
  budget: number
  revenue: number
}

const route = useRoute()
const movieId = route.params.id
const config = useRuntimeConfig()
const movieDetails = ref<MovieDetails | null>(null)

async function fetchMovieDetails() {
  console.log("Fetching movie details for movie ID:", movieId)
  
  try {
    const response = await useMovieServiceFetch<{ 
      success: boolean
      message: string
      data: {
        title: string
        overview: string
        release_date: string
        runtime: number
        vote_average: number
        genres: Array<{ id: number, name: string }>
        poster_path: string
        backdrop_path: string
        production_companies: Array<{ id: number; name: string; logo_path: string | null }>
        tagline: string
        budget: number
        revenue: number
      }
    }>(`movie/${movieId}`)

    if (response && response.success) {
      const movieData = response.data
      movieDetails.value = {
        title: movieData.title,
        overview: movieData.overview,
        release_date: movieData.release_date,
        runtime: movieData.runtime,
        vote_average: movieData.vote_average,
        genres: movieData.genres,
        posterUrl: `${config.public.tmdbImageBaseUrl}/w500${movieData.poster_path}`,
        backdrop_path: `${config.public.tmdbImageBaseUrl}/original${movieData.backdrop_path}`,
        production_companies: movieData.production_companies,
        tagline: movieData.tagline,
        budget: movieData.budget,
        revenue: movieData.revenue
      }
      console.log("Movie details loaded:", movieDetails.value)
    } else {
      console.warn("Movie data not found or success is false")
    }
  } catch (e) {
    console.error("Failed to fetch movie details:", e)
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(() => {
  fetchMovieDetails()
})
</script>

<style scoped>

.fixed-backdrop {
  width: 100%; 
  height: 400px; 
  object-fit: cover; 
  object-position: center; 
}
</style>
