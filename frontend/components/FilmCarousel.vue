<template>
  <div v-if="status === 'pending'" class="flex w-[950px] justify-self-center items-center gap-[10px] py-8">
    <USkeleton class="w-[230px] h-[345px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    <USkeleton class="w-[230px] h-[345px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    <USkeleton class="w-[230px] h-[345px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    <USkeleton class="w-[230px] h-[345px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
  </div>

  <template v-else>
    <div class="mx-16">
      <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'snap-start', wrapper: 'w-fit justify-self-center', container: 'w-[950px] justify-self-center gap-[10px] py-8' }" 
        arrows
        :prev-button="{
          color: 'gray',
          icon: 'i-mingcute-left-small-line',
          class: '-left-12'
        }"
        :next-button="{
          color: 'gray',
          icon: 'i-mingcute-right-small-line',
          class: '-right-12'
        }"
      >
        <div>
          <img :src="item" draggable="false"
            class="w-[230px] h-[345px] object-cover object-center rounded border-[1px] border-neutral-700">
        </div>
      </UCarousel>
    </div>
  </template>
</template>

<script setup lang="ts">

interface Movie {
  poster_path: string
}

interface MovieResponse {
  success: boolean
  message: string
  data: {
    page: number
    results: Movie[]
    total_pages: number
    total_results: number
  }
}

const config = useRuntimeConfig()

const items = ref<string[]>([])

const { status } = await useMovieService<MovieResponse>('trending/movie/week', {
  method: 'GET',
  query: { language: 'pt-BR', page: '1' },
  transform: (response) => {
    if(response.success){
      status.value = 'ready'

      if (response && response.data.results) {
        setPosters(response.data.results)
      }
    }
  }
})

function setPosters(movies: Movie[]) {
  for (const movie of movies) {
    items.value.push(`${config.public.tmdbImageBaseUrl}/w500/${movie.poster_path}`)
  }
}
</script>
