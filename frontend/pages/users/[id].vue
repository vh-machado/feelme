<template>
  <div class="flex flex-col gap-10 w-full md:w-[950px] justify-self-center px-4 py-8 md:px-0">
    <div class="flex gap-5 items-center">
      <UAvatar
        size="3xl"
        class="ring-[1px] ring-neutral-300/50"
        :src="dataUri"
        alt="Avatar"
      />
      
      <div class="flex flex-col gap-2">
        <span class="font-bold text-2xl">
          {{ user.name }}
        </span>

        <span class="text-gray-400">
          @{{ user.nickname }}
        </span>
      </div>
    </div>

    <div class="flex flex-wrap w-full gap-3">
      <div v-for="emotion in emotions" :key="emotion.description" class="flex gap-3 rounded-xl p-1 pe-3 bg-[#7588E1]/10">
        <UTooltip :text="emotion.description" class="flex gap-2">
          <span class="lg:text-lg cursor-pointer">
            {{ emotion.emoji }}
          </span>

          <span class="lg:text-lg cursor-pointer">
            {{ emotion.counter }}
          </span>
        </UTooltip>
      </div>
    </div>


    <div v-if="status !== 'pending'" class="flex flex-col w-full gap-6">
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
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'
import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
import type { EmotionCounter, Review } from '~/server/models'; 

const { user } = storeToRefs(useSessionStore());

const config = useRuntimeConfig()

const avatar = createAvatar(notionistsNeutral, {
  seed: 'Feelme',
  backgroundColor: ["b6e3f4","c0aede","d1d4f9"]
});

const dataUri = await avatar.toDataUri();

const toast = useToast()
const reviews = ref<Review[]>([])
const emotions = ref<EmotionCounter[]>([])

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

await useEmotionAnalysisService(`/emotion-analysis/user/${user.value.id}`, {
  method: 'GET',
  onResponse({ response }) {
    if(response.status === 200) {
      emotions.value = response._data
    } else {
      toast.add({ 
        title: 'Não foi possível buscar análise de emoções!',
        description: response._data.msg,
        color: 'red', 
        icon: 'i-mingcute-unhappy-fill'
      })
    }
  }
})

</script>