<template>
  <div class="font-montserrat h-screen bg-gradient-to-b from-dark-purple to-rich-black">
    <NuxtLoadingIndicator :height="2" :throttle="0" />

    <NuxtLayout v-if="authenticated">
      <NuxtPage />
    </NuxtLayout>

    <NuxtPage v-else/>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

useHead({
  title: 'Feelme'
})

const { authenticated } = storeToRefs(useAuthStore()); // make authenticate
</script>
