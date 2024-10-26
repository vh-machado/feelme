<template>
  <div class="flex flex-col w-full md:w-[950px] justify-self-center p-4 md:px-0 py-8 gap-8">
    <div v-if="status === 'pending'" class="flex flex-col gap-4 p-4 md:px-0 py-8">
      <div class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full', background: 'dark:bg-[#7588E1]/10' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
          <USkeleton class="h-4 w-[200px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
        </div>
      </div>
      
      <USkeleton class="w-full h-[160px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />

      <div class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full', background: 'dark:bg-[#7588E1]/10' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
          <USkeleton class="h-4 w-[200px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
        </div>
      </div>
      
      <USkeleton class="w-full h-[160px]" :ui="{ background: 'dark:bg-[#7588E1]/10' }" />
    </div>
    
    <div v-else class="flex flex-col gap-6">
      <ReviewCard
        v-for="review in reviews" 
        :id="review._id"
        :key="review._id"
        :user-movie="review.userMovie" 
        :text="review.text" 
        :likes="review.likes" 
        :emotions="review.emotions"
      />
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
      });
    } else {
      toast.add({ 
        title: 'Não foi possível buscar críticas!',
        description: response._data.msg,
        color: 'red', 
        icon: 'i-mingcute-unhappy-fill'
      })
    }
  }
})

</script>