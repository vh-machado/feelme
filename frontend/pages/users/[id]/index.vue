<template>
  <div class="flex flex-col gap-10 w-full md:w-[950px] justify-self-center px-4 py-8 md:px-0">
    <div v-if="userStatus !== 'pending'" class="flex flex-col lg:flex-row lg:justify-between gap-5 items-start">
      <div class="flex items-center gap-5">
        <UAvatar
          size="3xl"
          class="ring-[1px] ring-neutral-300/50"
          :src="avatarUri"
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

      <UButton class="self-end lg:self-start" :to="`/users/${route.params.id}/edit`" color="indigo" label="Editar" icon="i-mingcute:edit-2-fill"/>
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

    <div v-if="reviewsStatus !== 'pending'" class="flex flex-col w-full gap-6">
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

import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
import type { EmotionCounter, Review, User } from '~/server/models'; 

const route = useRoute()

const toast = useToast()
const user = ref<User>({ _id: '', name: '', nickname: '', followers: 0, avatar: 'Leo' })
const reviews = ref<Review[]>([])
const emotions = ref<EmotionCounter[]>([])
const avatarUri = ref<string>(generateAvatarUri(user.value.avatar))

watch(user, () => {
  avatarUri.value = generateAvatarUri(user.value.avatar)
})

function generateAvatarUri(avatarSeed: string) {
  const avatar = createAvatar(notionistsNeutral, {
    seed: avatarSeed,
    backgroundColor: ["c0aede", "ADB3DE","d1d4f9"]
  });

  const dataUri = avatar.toDataUri();

  return dataUri
}

const { status: userStatus } = await useSocialService(`user/${route.params.id}`, {
  method: 'GET',
  onResponse({ response }) {
    if(response.status === 200) {
      user.value = response._data
    } else {
      toast.add({ 
        title: 'Não foi possível encontrar usuário!',
        description: response._data.msg,
        color: 'red', 
        icon: 'i-mingcute-unhappy-fill'
      })
    }
  }
})

const { status: reviewsStatus } = await useSocialService(`reviews/user/${route.params.id}`, {
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

await useEmotionAnalysisService(`/emotion-analysis/user/${route.params.id}`, {
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