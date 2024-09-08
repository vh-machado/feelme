<template>
  <div class="font-montserrat">
    <NuxtLoadingIndicator height="2" throttle="0" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Feelme'
})
</script>
