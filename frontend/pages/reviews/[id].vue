<template>
  <div class="flex flex-col gap-2 w-full md:w-[950px] justify-self-center px-4 py-8 md:px-0">
    <div v-if="status === 'pending'" class="flex flex-col gap-4 p-4">
      <div class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full', background: 'dark:bg-[#7588E1]/10' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
          <USkeleton class="h-4 w-[200px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
        </div>
      </div>
      
      <USkeleton class="w-full h-[160px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    </div>
    
    <ReviewCard
      v-if="review"
      :id="review._id"
      :user-movie="review.userMovie" 
      :text="review.text" 
      :likes="review.likes" 
      :emotions="review.emotions"
    />
  </div>
</template>

<script setup lang="ts">

import type { Review } from '~/server/models';

const route = useRoute()

const toast = useToast()
const review = ref<Review>()

const { status } = await useSocialService(`review/${route.params.id}`, {
  method: 'GET',
  onResponse({ response }) {
    if(response.status === 200) {
      review.value = response._data
    } else {
      toast.add({ 
        title: 'Não foi possível buscar crítica!',
        description: response._data.msg,
        color: 'red', 
        icon: 'i-mingcute-unhappy-fill'
      })
    }
  }
})

</script>