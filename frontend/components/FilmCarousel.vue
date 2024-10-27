<template>
  <div v-if="status === 'pending'" class="flex w-full justify-center justify-self-center items-center gap-[10px] py-8">
    <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
  </div>

  <template v-else>
    <div class="hidden lg:flex mx-16 justify-center">
      <UCarousel 
        v-slot="{ item }" :items="items" :ui="{ item: 'snap-start', wrapper: 'w-fit justify-self-center', container: 'w-[950px] justify-self-center gap-[10px] py-8' }" 
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
        <ULink :to="`films/${item.id}`">
          <img
            :src="item.poster_path" draggable="false"
            class="w-[230px] h-[345px] object-cover object-center rounded border-[1px] border-neutral-700">
        </ULink>
      </UCarousel>
    </div>

    <div class="flex lg:hidden justify-center">
      <UCarousel 
        v-slot="{ item }" :items="items" :ui="{ item: 'snap-start', wrapper: 'w-full justify-self-center', container: 'w-full py-8 pe-3' }" 
      >
        <ULink :to="`films/${item.id}`" class="ml-3">
          <img
            :src="item.poster_path" draggable="false"
            class="w-[105px] h-[157.5px] object-cover object-center rounded border-[1px] border-neutral-700">
        </ULink>
      </UCarousel>
    </div>
  </template>
</template>

<script setup lang="ts">

interface Movie {
  id: string
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

const items = ref<Movie[]>([])

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
    items.value.push({
      id: movie.id,
      poster_path: `${config.public.tmdbImageBaseUrl}/w500/${movie.poster_path}`
    })
  }
}
</script>
