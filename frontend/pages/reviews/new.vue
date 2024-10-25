<template>
  <div class="flex flex-col gap-2 w-full md:w-[950px] justify-self-center p-4 md:p-8">
    <div class="flex gap-3 items-center w-fit bg-[#BBC1DA]/10 text-2xl font-bold rounded rounded-se-3xl p-3 pe-6">
      <UIcon name="i-mingcute:quill-pen-ai-fill" class="text-indigo-300" />

      Nova Review
    </div>

    <UCommandPalette
      v-model="selectedFilm"
      nullable
      placeholder="Buscar filme"
      :autoselect="false"
      :groups="groups"
      :empty-state="null"
      :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
      :ui="{ wrapper: 'bg-[#BBC1DA]/10 rounded' }"
    >
      <template #films-icon="{ command }">
        <img 
          :src="command.avatar.src"
          class="w-[70px] h-[105px] object-cover object-center rounded border-[1px] border-neutral-600 shadow-2xl"
        >
      </template>
    </UCommandPalette>

    <div v-if="selectedFilm" class="flex gap-4 rounded p-4 bg-gradient bg-gradient-to-b from-[#BBC1DA]/10 to-[#7588E1]/10">
      <img 
        :src="`${config.public.tmdbImageBaseUrl}/w500${selectedFilm.posterPath}`" draggable="false"
        class="w-[105px] h-[157.5px] object-cover object-center rounded border-[1px] border-neutral-400 shadow-2xl"
      >
      
      <div class="flex flex-col gap-4 w-full">
        <div class="text-xl font-bold">
          {{ selectedFilm.label }}
        </div>
        
        <UTextarea v-model="text" autoresize :padded="false" color="indigo" variant="none" placeholder="Escreva sua crítica aqui..." :ui="{ variant: { outline: 'dark:ring-gray-700 dark:bg-gray-900' }}" />
      </div>
    </div>

    <div class="flex gap-3 items-center justify-end">
      <UButton to="/" size="lg" color="gray">
        Cancelar
      </UButton>

      <UButton v-if="selectedFilm" size="lg" color="green" icon="i-mingcute:check-fill">
        Postar
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const text = ref<string>('')

interface SearchedFilm {
  id: string
  label: string
  suffix: string
  posterPath: string
}

const selectedFilm = ref<SearchedFilm>()

const groups = [{
  key: 'films',
  label: q => q && `Filmes correspondentes a “${q}”...`,
  search: async (q) => {
    if (!q) {
      return []
    }

    let films: SearchedFilm[]
    
    await useMovieService('search/movie', {
      method: 'GET',
      query: { language: 'pt-BR', page: '1', query: q },
      transform: (response) => {
        films = response.data.results.map(film => (
          { 
            id: film.id, 
            avatar: { 
              src: `${config.public.tmdbImageBaseUrl}/w500/${film.poster_path}`, 
              srcset: `${config.public.tmdbImageBaseUrl}/w500/${film.poster_path} 2x`, 
              loading: 'lazy'
            },
            label: film.title, 
            suffix: film.release_date.split('-')[0],
            posterPath: film.poster_path 
          }
        ))
      }
    })

    return films
  }
}]

</script>