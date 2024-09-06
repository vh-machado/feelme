<template>
  <div v-if="pending" class="flex items-center gap-4 p-4">
    <USkeleton class="w-full h-[345px]" />
  </div>

  <template v-else>
    <div class="mx-16">
      <UCarousel v-slot="{ item }" :items="items" :ui="{ container: 'gap-4 py-8 px-4' }" 
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
const config = useRuntimeConfig()

const { pending } = await useMovieAPI('trending/movie/week', {
  method: 'GET',
  query: { language: 'en-US', page: '1' },
  transform: (data) => {
    setPosters(data.results)
  }
})

async function setPosters(movies: any[]) {
  for (const movie of movies) {
    items.value.push(`${config.public.tmdbImageBaseUrl}/w500/${movie.poster_path}`)
  }
}

const items = ref([])
</script>
