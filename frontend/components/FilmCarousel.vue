<template>
  <UCarousel v-slot="{ item }" :items="items" :ui="{ container: 'gap-4 p-4' }">
    <div class="p-4 bg-neutral-800 rounded">
      <img :src="item" width="200" height="400" draggable="false">
    </div>
  </UCarousel>

  {{ data }}
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const { data } = await useFetch(`/movie/popular`, {
  baseURL: config.public.tmdbApiUrl,
  query: { language: 'en-US', page: '1' },
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${config.public.tmdbApiKey}`
  }
})

const items = [
  'https://picsum.photos/600/800?random=1',
  'https://picsum.photos/600/800?random=2',
  'https://picsum.photos/600/800?random=3',
  'https://picsum.photos/600/800?random=4',
  'https://picsum.photos/600/800?random=5',
  'https://picsum.photos/600/800?random=6'
]
</script>
