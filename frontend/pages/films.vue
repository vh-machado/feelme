<template>
  <div class="flex w-full flex-col justify-center items-center gap-4 p-4">
    <UForm class="flex justify-center w-1/2" :schema="searchSchema" :state="searchState" @submit="search">
      <UFormGroup class="w-full" name="search">
        <UInput 
          v-model="searchState.search"
          class="w-full" 
          type="text"
          color="primary" 
          size="xl"
          variant="outline" 
          placeholder="Pesquisar filme..." 
          icon="i-heroicons-magnifying-glass-20-solid"
          :loading="false"
        />
      </UFormGroup>
      <div class="flex w-1/6 flex-col justify-center items-center gap-4 px-4">
        <UButton block type="submit" color="green" size="lg" class="font-semibold">
          Buscar
        </UButton>
      </div>
    </UForm>
    <div class="flex w-[950px] flex-col gap-4 justify-center mt-4" v-if="status !== 'pending' && items.length > 0">
      <div v-for="(item, index) in items" :key="index" class="flex items-center gap-4">
        <img :src="item.poster" draggable="false"
          class="w-[230px] h-[345px] object-cover object-center rounded border-[1px] border-neutral-700">
        <div class="flex flex-row justify-between h-[345px] text-right">
          <p class="text-lg font-bold">{{ item.title }}, {{ item.year }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="status !== 'pending' && items.length === 0" class="text-center mt-4">
      <p class="text-lg text-gray-500">Nenhum filme encontrado.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const status = ref<string>('pending')
const config = useRuntimeConfig()
const items = ref<{ poster: string, title: string, year: string }[]>([])

interface MovieResponse {
  success: boolean
  message: string
  data: {
    page: number
    results: { poster_path: string, title: string, release_date: string }[]
    total_pages: number
    total_results: number
  }
}

const searchSchema = object({
  search: string()
    .min(3, 'Digite pelo menos 3 caracteres')
    .required('Obrigatório escrever pelo menos 3 caracteres'),
})

type SeacrhSchema = InferType<typeof searchSchema>

const searchState = reactive({
  search: undefined,
})

const search = async (event: FormSubmitEvent<SeacrhSchema>) => {
  status.value = 'pending'
  items.value = []

  const { data, error } = await useMovieService<MovieResponse>('search/movie', {
    method: 'GET',
    query: { query: event.data.search, language: 'pt-BR', page: '1' },
    transform: (response) => {
      if (response.success) {
        status.value = 'ready'
      }
      return response
    }
  })

  if (data.value && data.value.data.results) {
    setPosters(data.value.data.results)
  }
}

function setPosters(movies: { poster_path: string, title: string, release_date: string }[]) {
  for (const movie of movies) {
    const year = new Date(movie.release_date).getFullYear().toString() // Extrair o ano de lançamento
    items.value.push({
      poster: `${config.public.tmdbImageBaseUrl}/w500/${movie.poster_path}`,
      title: movie.title,
      year: year 
    })
  }
}
</script>
