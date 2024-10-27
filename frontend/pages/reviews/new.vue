<template>
  <div class="flex flex-col gap-2 w-full md:w-[950px] justify-self-center px-4 py-8 md:px-0">
    <div class="flex gap-3 items-center w-fit bg-[#BBC1DA]/10 text-lg lg:text-2xl font-bold rounded rounded-se-3xl p-3 pe-6">
      <UIcon name="i-mingcute:quill-pen-ai-fill" class="text-indigo-300" />

      Nova Review
    </div>

    <UCommandPalette
      v-model="selectedMovie"
      nullable
      placeholder="Buscar filme"
      :autoselect="false"
      :groups="groups"
      :empty-state="null"
      :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
      :ui="{ wrapper: 'bg-[#BBC1DA]/10 rounded' }"
    >
      <template #movies-icon="{ command }">
        <img 
          :src="command.avatar.src"
          class="w-[70px] h-[105px] object-cover object-center rounded border-[1px] border-neutral-600 shadow-2xl"
        >
      </template>
    </UCommandPalette>

    <div v-if="selectedMovie" class="flex gap-4 rounded p-4 bg-gradient bg-gradient-to-b from-[#BBC1DA]/10 to-[#7588E1]/10">
      <img 
        :src="`${config.public.tmdbImageBaseUrl}/w500${selectedMovie.posterPath}`" draggable="false"
        class="w-[70px] lg:w-[105px] h-[105px] lg:h-[157.5px] object-cover object-center rounded border-[1px] border-neutral-400 shadow-2xl"
      >
      
      <div class="flex flex-col gap-4 w-full">
        <div class="lg:text-xl font-bold">
          {{ selectedMovie.label }}
        </div>
        
        <UTextarea v-model="text" autoresize :padded="false" color="indigo" variant="none" placeholder="Escreva sua crítica aqui..." :ui="{ variant: { outline: 'dark:ring-gray-700 dark:bg-gray-900' }}" />
      </div>
    </div>

    <div class="flex gap-3 items-center justify-end">
      <UButton to="/" size="lg" color="gray">
        Cancelar
      </UButton>

      <UButton v-if="selectedMovie" :loading="reviewPostRequest.status === 'pending'"   size="lg" color="green" icon="i-mingcute:check-fill" @click="submitReview">
        Postar
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const toast = useToast()
const route = useRoute()

const { user } = storeToRefs(useSessionStore());

const config = useRuntimeConfig()

const text = ref<string>("")

interface SearchedMovie {
  id: string
  label: string
  suffix: string
  posterPath: string
}

const selectedMovie = ref<SearchedMovie>()
const reviewPostRequest = ref({ status: null })

if (route.query.movie) {
  setSelectedMovieFromPath(String(route.query.movie))
}

const groups = [{
  key: 'movies',
  label: q => q && `Filmes correspondentes a “${q}”...`,
  search: async (q) => {
    if (!q) {
      return []
    }

    let movies: SearchedMovie[] = []
    
    await useMovieService('search/movie', {
      method: 'GET',
      query: { language: 'pt-BR', page: '1', query: q },
      transform: (response) => {
        movies = response.data.results.map(movie => (
          { 
            id: movie.id, 
            avatar: { 
              src: `${config.public.tmdbImageBaseUrl}/w500/${movie.poster_path}`, 
              srcset: `${config.public.tmdbImageBaseUrl}/w500/${movie.poster_path} 2x`, 
              loading: 'lazy'
            },
            label: movie.title, 
            suffix: movie.release_date.split('-')[0],
            posterPath: movie.poster_path 
          }
        ))
      }
    })

    return movies
  }
}]

async function setSelectedMovieFromPath(movieId: string) {
  await useMovieService(`movie/${movieId}`, {
    method: 'GET',
    query: { language: 'pt-BR', page: '1' },
    transform: (response) => {
      selectedMovie.value = {
        id: response.data.id,
        label: response.data.title,
        suffix: response.data.release_date.split('-')[0],
        posterPath: `${config.public.tmdbImageBaseUrl}/w500/${response.data.poster_path}`
      }
    }
  })
}

async function submitReview() {
  reviewPostRequest.value = await useSocialService('review', {
    method: 'POST',
    body: {
      userId: user.value.id,
      movieId: selectedMovie.value?.id,
      text: text.value,
      loggedAt: new Date(),
      rewatch: false,
      likes: 0
    },
    onResponse({ response }) {
      if(response.status === 201) {
        toast.add({ 
          title: 'Crítica postada!',
          color: 'green', 
          icon: 'i-mingcute:quill-pen-ai-fill'
        })

        navigateTo(`/reviews/${response._data._id}`)
      } else {
        toast.add({ 
          title: 'Não foi possível postar a crítica!',
          description: response._data.msg,
          color: 'red', 
          icon: 'i-mingcute-unhappy-fill'
        })
      }
    }
  })
}

</script>