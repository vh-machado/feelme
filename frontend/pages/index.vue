<template>
  <div class="flex flex-col py-8">
    <FilmCarousel />

    <UButton to="/reviews/new" square color="green" size="xl" class="fixed bottom-0 right-0 m-5 font-semibold" :ui="{ base:'lg:hidden', rounded: 'rounded-full', square: { xl: 'p-5' } }" icon="i-mingcute:quill-pen-ai-fill"/>
  
    <RecommendationCarousel />
  </div>
</template>

<script setup lang="ts">

</script>