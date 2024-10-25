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

    <div class="flex w-[950px] flex-col gap-4 justify-center mt-4" v-if="status !== 'pending'">
      <div v-if="paginatedItems.length > 0">
        <div v-for="(item, index) in paginatedItems" :key="index" class="flex items-center gap-4">
          <img :src="item.poster" draggable="false"
            class="w-[230px] h-[345px] object-cover object-center rounded border-[1px] border-neutral-700">
          <div class="flex flex-row justify-between h-[345px] text-right">
            <p class="text-lg font-bold">{{ item.title }}, {{ item.year }}</p>
          </div>
        </div>

        <UPagination
          v-model="page"
          :page-count="totalPages"
          :total="totalResults"
          :to="(page: number) => ({
            query: { page },
            hash: '#links'
          })"
        />
      </div>
      <div v-else class="text-center mt-4">
        <p class="text-lg text-gray-500">Nenhum filme encontrado.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import { ref, reactive, computed, watch } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const status = ref<string>('pending')
const config = useRuntimeConfig()
const items = ref<{ poster: string, title: string, year: string }[]>([])
const page = ref(1)
const totalResults = ref(0) 
const itemsPerPage = 10 
const apiResultsPerPage = 20


const totalPages = computed(() => Math.ceil(totalResults.value / itemsPerPage));

// Computed para paginar os itens
const paginatedItems = computed(() => paginateItems(items.value, page.value));

interface MovieResponse {
  success: boolean
  message: string
  data: {
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
  page.value = 1 

  const { data, error } = await useMovieService<MovieResponse>('search/movie', {
    method: 'GET',
    query: { query: searchState.search, language: 'pt-BR', page: '1' },
    transform: (response) => {
      if (response.success) {
        status.value = 'ready'
      }
      return response
    }
  })

  if (data.value && data.value.data.results) {
    totalResults.value = data.value.data.total_results; 
    setPosters(data.value.data.results); 
  } else {
    status.value = 'ready';
  }
}


function setPosters(movies: { poster_path: string, title: string, release_date: string }[]) {
  items.value = [] 
  for (let i = 0; i < Math.min(movies.length, itemsPerPage); i++) {
    const movie = movies[i];
    const year = new Date(movie.release_date).getFullYear().toString()
    items.value.push({
      poster: `${config.public.tmdbImageBaseUrl}/w500/${movie.poster_path}`,
      title: movie.title,
      year: year
    })
  }
}

function paginateItems(items: { poster: string, title: string, year: string }[], currentPage: number) {
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  return items.slice(start, end)
}

watch(() => route.query.page, (newPage) => {
  if (newPage) {
    page.value = Number(newPage); 
    fetchPage(page.value);
  }
});


watch(items, (newItems) => {
  if (newItems.length === 0) {
    status.value = 'ready';
  }
});

async function fetchPage(newPage: number) {
  const { data, error } = await useMovieService<MovieResponse>('search/movie', {
    method: 'GET',
    query: { query: searchState.search, language: 'pt-BR', page: newPage }, 
  })


  if (data.value && data.value.data.results) {
    totalResults.value = data.value.data.total_results; 
    setPosters(data.value.data.results); 
  } else {
    items.value = [];
    status.value = 'ready';
  }
}
</script>

