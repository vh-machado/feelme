<template>
  <div v-if="items.length >= 8" class="flex flex-col w-full items-center">
    <div class="flex w-full lg:w-[950px] gap-3 px-3 lg:px-0 -mb-4">
      <UIcon class="w-5 h-5" name="i-mingcute:sparkles-fill"/>

      <span class="font-medium">Recomendações <span class="text-indigo-300">para você</span></span>
    </div>

    <div v-if="status === 'pending'" class="flex w-full justify-center justify-self-center items-center gap-[10px] py-8">
      <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
      <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
      <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
      <USkeleton class="lg:w-[230px] lg:h-[345px] w-[105px] h-[157.5px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    </div>
    
    <template v-else>
      <div class="hidden lg:flex flex-col mx-16 justify-center">
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
            class="w-[110px] h-[165px] object-cover object-center rounded border-[1px] border-neutral-700">
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
  </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

interface Movie {
  id: string
  poster_path: string
}

const { user } = storeToRefs(useSessionStore());

const config = useRuntimeConfig()

const items = ref<Movie[]>([])

const { status } = await useEmotionAnalysisService(`/emotion-analysis/user/${user.value.id}/movies`, {
  method: 'GET',
  onResponse({ response }) {
    const movieIds: number[] = response._data

    if(movieIds.length > 0) {
      useMovieService('/movie/discover', {
        method: 'POST',
        body: {
          movieIds
        },
        onResponse({ response }) {
          setPosters(response._data.data)
        }
      })
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
