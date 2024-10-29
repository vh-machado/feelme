<template>
  <div class="flex flex-col w-full gap-2">
    <div class="flex gap-2 items-center font-bold">
      <UAvatar
        :ui="{ wrapper: 'ring-[1px] ring-neutral-400' }"
        src="https://avatars.githubusercontent.com/u/73856054?v=4"
        alt="Avatar"
      />

      {{ userMovie.user.nickname }}
    </div>

    <ULink v-if="route.path !== `/reviews/${id}`" :to="`/reviews/${id}`" class="flex gap-4 rounded p-4 bg-gradient bg-gradient-to-b from-[#BBC1DA]/10 to-[#7588E1]/10">
      <img 
        :src="`${config.public.tmdbImageBaseUrl}/w500${userMovie.movie.posterPath}`" draggable="false"
        class="w-[70px] lg:w-[105px] h-[105px] lg:h-[157.5px] object-cover object-center rounded border-[1px] border-neutral-400 shadow-2xl"
      >
      
      <div class="flex flex-col gap-4">
        <div class="text-sm lg:text-xl font-bold">
          {{ userMovie.movie.title }}
        </div>
        
        <span class="text-xs lg:text-base break-all">
          {{ text }}
        </span>
      </div>
    </ULink>


    <div v-else class="flex gap-4 rounded p-4 bg-gradient bg-gradient-to-b from-[#BBC1DA]/10 to-[#7588E1]/10">
      <ULink :to="`/films/${userMovie.movie.id}`">
        <img 
          :src="`${config.public.tmdbImageBaseUrl}/w500${userMovie.movie.posterPath}`" draggable="false"
          class="w-[70px] lg:w-[105px] h-[105px] lg:h-[157.5px] object-cover object-center rounded border-[1px] border-neutral-400 shadow-2xl"
        >
      </ULink>
      
      <div class="flex flex-col gap-4">
        <div class="text-sm lg:text-xl font-bold">
          {{ userMovie.movie.title }}
        </div>
        
        <span class="text-xs lg:text-base break-all">
          {{ text }}
        </span>
      </div>
    </div>

    <div class="flex gap-3 items-start justify-between">
      <div class="rounded rounded-ee-3xl p-1 pe-3 bg-[#7588E1]/10">
        <div v-if="emotions.length > 0" class="flex items-center ">
          <UTooltip v-for="emotion in emotions" :key="emotion.description" :text="emotion.description">
            <span class="lg:text-lg cursor-pointer">
              {{ emotion.emoji }}
            </span>
          </UTooltip>
        </div>
        
        <div v-else class="flex gap-3 items-center text-xs p-2">
          <USkeleton class="h-4 w-4" :ui="{ rounded: 'rounded-full', background: 'dark:bg-indigo-400' }" />

          Analisando emoções
        </div>
      </div>
      
      <UButton v-if="props.userMovie.user._id !== user.id" size="lg" :color="likedReview ? 'red' : 'gray'" variant="ghost" icon="ic:round-favorite" :ui="{ variant: { ghost: likedReview ? 'dark:hover:bg-red-500/20' : 'dark:hover:bg-gray-400/20' }, rounded: 'rounded rounded-es-3xl'}" @click="updateLikedReview">
        {{ likesCount }}
      </UButton>

      <div v-else class="flex items-center gap-2 p-3 text-red-400 rounded rounded-es-3xl">
        <UIcon class="w-5 h-5" name="ic:round-favorite"/>
        
        <span class="font-medium text-sm">
          {{ likesCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const { user } = storeToRefs(useSessionStore());

const config = useRuntimeConfig()
const route = useRoute()

const toast = useToast()

const props = defineProps<{
  id: string
  userMovie: {
    user: {
      _id: string
      nickname: string
    }
    movie: {
      id: number
      title: string
      posterPath: string
    }
  }
  text: string
  likes: number
  emotions: {
    emoji: string
    description: string
  }[]
}>()

const likedReview = ref<boolean>(false)
const likesCount = ref<number>(props.likes)

await useSocialService(`userLike/exists/${user.value.id}/${props.id}`, {
  method: 'GET',
  onResponse({ response }) {
    if(response.status === 200) {
      likedReview.value = response._data.exists
    }
  }
})

async function updateLikedReview() {
  if(likedReview.value) {
    await useSocialService(`userLike/review/${props.id}`, {
      method: 'DELETE',
      onResponse({ response }) {
        if(response.status === 200) {
          likedReview.value = false
          likesCount.value--
        } else {
          toast.add({ 
            title: 'Não foi possível descurtir a crítica!',
            description: response._data.msg,
            color: 'red', 
            icon: 'i-mingcute-unhappy-fill'
          })
        }
      }
    })
  } else {
    await useSocialService('userLike', {
      method: 'POST',
      body: {
        userId: user.value.id,
        reviewId: props.id
      },
      onResponse({ response }) {
        if(response.status !== 200) {
          likedReview.value = true
          likesCount.value++
        } else {
          toast.add({ 
            title: 'Não foi possível curtir a crítica!',
            description: response._data.msg,
            color: 'red', 
            icon: 'i-mingcute-unhappy-fill'
          })
        }
      }
    })
  }
}

</script>