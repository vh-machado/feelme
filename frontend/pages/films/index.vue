<template>
  <div class="flex w-full lg:w-[950px] flex-col justify-center items-center gap-4 py-8 px-3 lg:px-0">
    <div class="flex w-full gap-2">
      <form if="form" class="flex w-full gap-2" @submit.prevent="pushSearchMovieRoute(movieSearch, 1)">
        <UInput
          v-model="movieSearch"
          class="w-full" 
          type="text"
          color="gray"
          size="xl"
          variant="outline" 
          placeholder="Pesquisar filme..." 
          icon="i-heroicons-magnifying-glass-20-solid"
          :loading="false"
        />

        <UButton type="submit" color="indigo" size="lg" class="font-semibold">
          Buscar
        </UButton>
      </form>
    </div>

    <div class="flex flex-col w-full gap-2">
      <ULink v-for="movie in movies" :key="movie.id" :to="`/films/${movie.id}`" class="flex gap-4 rounded p-4 bg-gradient bg-gradient-to-b from-[#BBC1DA]/10 to-[#7588E1]/10">
        <img 
          :src="`${config.public.tmdbImageBaseUrl}/w500${movie.posterPath}`" draggable="false"
          class="w-[70px] lg:w-[105px] h-[105px] lg:h-[157.5px] object-cover object-center rounded border-[1px] border-neutral-400 shadow-2xl"
        >
        
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3 flex-wrap">
            <div class="text-sm lg:text-xl font-bold">
              {{ movie.title }}
            </div>

            <span class="font-light text-sm">
              {{ movie.releaseDate }}
            </span>
          </div>
          
          <span class="text-xs lg:text-sm break-all">
            {{ movie.overview }}
          </span>
        </div>
      </ULink>
    </div>

    <UPagination
      v-if="movies.length > 0"
      v-model="page"
      :page-count="20"
      :total="totalMovies"
      @update:model-value="() => updatePage()"
    />
  </div>

  
</template>

<script setup lang="ts">

import type { Movie } from '~/server/models';

interface MovieResponse {
  id: number
  title: string
  overview: string
  poster_path: string
  release_date: string
}

interface MovieSearchQuery {
  search: string
  page: number
}

const config = useRuntimeConfig()
const route = useRoute()

const movies = ref<Movie[]>([])
const movieSearch = ref<string>(route.query.search ? String(route.query.search) : '')
const page = ref<number>(route.query.page ? Number(route.query.page) : 1)
const totalMovies = ref<number>(0)

if(route.query.search && route.query.page) {
  await searchMovie({
    search: String(route.query.search),
    page: Number(route.query.page)
  })
}

function updatePage() {
  const search = String(route.query.search)

  pushSearchMovieRoute(search, page.value)
}

watch(() => route.query, () => {
  const search = String(route.query.search)
  const page = Number(route.query.page)

  searchMovie({ search, page })
})

function pushSearchMovieRoute(search: string, page: number) {
  navigateTo(`films?search=${search}&page=${page}`)
}

async function searchMovie({ search, page }: MovieSearchQuery) {
  await useMovieService('/search/movie', {
    method: 'GET',
    query: { language: 'pt-BR', page: page, query: search },
    onResponse: ({ response }) => {
      if(response.status === 200) {
        movies.value = response._data.data.results.map((movie: MovieResponse) => ({
          ...movie,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date.split('-')[0]
        }))
      
        page = response._data.data.page
        totalMovies.value = response._data.data.total_results
      }
    }
  })
}

</script>
