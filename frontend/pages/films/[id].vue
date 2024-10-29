<template>
  <div v-if="movieDetails" class="flex flex-col relative items-center px-4 pb-20 lg:px-0 lg:pb-0">
    <img 
      :src="movieDetails.backdrop_path" 
      alt="Backdrop do Filme" 
      class="h-auto lg:h-[400px] w-full lg:w-[950px] object-cover object-center rounded-b-3xl shadow-xl" 
    >

    <div class="flex w-full lg:w-[950px] gap-8 lg:gap-12 py-8 lg:py-12">
      <div class="flex flex-col gap-6 lg:gap-10 w-full">
        <div class="flex gap-3">
          <div class="flex flex-col gap-2 lg:gap-4 w-full">
            <h1 class="text-xl lg:text-2xl font-bold">{{ movieDetails.title }}</h1>
    
            <div class="flex flex-col lg:flex-row gap-2 lg:gap-5">
              <div class="flex gap-2 text-sm">
                <UIcon name="i-mingcute:calendar-line" class="w-5 h-5 text-indigo-400" />
                
                {{ formatDate(movieDetails.release_date) }}
              </div>
              
              <div class="flex gap-2 text-sm">
                <UIcon name="i-mingcute:time-line" class="w-5 h-5 text-indigo-400" />
                
                {{ movieDetails.runtime }} mins
              </div>
            </div>
          </div>

          <img 
              :src="movieDetails.posterUrl" 
              alt="Poster do Filme" 
              class="lg:hidden w-[105px] h-[157.5px] -mt-16 me-5 object-cover object-center rounded border-[1px] border-neutral-700 shadow-xl" 
            >
        </div>

        <div class="flex flex-col gap-4 w-full">
          <p v-if="movieDetails.tagline" class="italic text-gray-500">{{ movieDetails.tagline.toUpperCase() }}</p>
          
          <p class="text-sm lg:text-base">{{ movieDetails.overview }}</p>

          <div class="flex flex-wrap gap-3 text-sm">
            <div v-for="genre in movieDetails.genres" :key="genre.name" class="bg-[#7588E1]/10 py-2 px-5 rounded-lg">
              {{ genre.name }}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 w-full">
          <div class="flex flex-col text-sm">
            <strong>Produção</strong>

            {{ movieDetails.production_companies.map(company => company.name).join(', ') }}
          </div>
        </div>
      </div>

      <div class="hidden lg:flex flex-col shrink-0 gap-4">
        <img 
          :src="movieDetails.posterUrl" 
          alt="Poster do Filme" 
          class="w-[230px] h-[345px] object-cover object-center rounded-lg border-[1px] border-neutral-600 shadow-xl" 
        >

        <UButton block :to="`/reviews/new?movie=${route.params.id}`" color="indigo" size="lg" class="font-semibold" icon="i-mingcute:quill-pen-ai-fill">
          Escrever crítica
        </UButton>
      </div>
    </div>

    <div class="fixed lg:hidden rounded-t-lg p-2 bottom-0 left-0 right-0 flex w-full bg-dark-purple">
      <UButton block :to="`/reviews/new?movie=${route.params.id}`" color="indigo" size="md" class="relative font-semibold" icon="i-mingcute:quill-pen-ai-fill">
        Escrever crítica
      </UButton>
    </div>
  </div>

  <div v-else class="flex w-full">
    <USkeleton class="flex w-full h-[400 px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
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
  console.log("Fetching movie details for movie")
  
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
      console.log("Movie details loaded")
    } else {
      console.warn("Movie data not found or success is false")
    }
  } catch (e) {
    console.error("Failed to fetch movie details:", e)
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchMovieDetails()
})
</script>
