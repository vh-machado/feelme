<template>
  <div>
    <div>reviews</div>

    <div v-if="status === 'pending'" class="flex items-center gap-4 p-4">
      <USkeleton class="w-full h-[345px]" />
    </div>

    <div v-else>
      {{ reviews }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '~/server/models';

const toast = useToast()
const reviews = ref<Review[]>([])

const { status } = await useSocialService('reviews', {
  method: 'GET',
  onResponse({ response }) {
    if(response.status === 200) {
      response._data.forEach((review: Review) => {
        reviews.value.push(review)
        console.log(reviews)
      });
    } else {
      toast.add({ 
        title: 'Não foi buscar críticas!',
        description: response._data.msg,
        color: 'red', 
        icon: 'i-mingcute-unhappy-fill'
      })
    }
  }
})

</script>