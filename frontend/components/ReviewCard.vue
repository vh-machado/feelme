<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 items-center font-bold">
      <UAvatar
        :ui="{ wrapper: 'ring-[1px] ring-neutral-400' }"
        src="https://avatars.githubusercontent.com/u/73856054?v=4"
        alt="Avatar"
      />

      {{ userMovie.user.nickname }}
    </div>

    <div class="flex gap-4 rounded p-4 bg-gradient bg-gradient-to-b from-[#BBC1DA]/10 to-[#7588E1]/10">
      <img 
        :src="`${config.public.tmdbImageBaseUrl}/w500${userMovie.movie.posterPath}`" draggable="false"
        class="w-[105px] h-[157.5px] object-cover object-center rounded border-[1px] border-neutral-400 shadow-2xl"
      >
      
      <div class="flex flex-col gap-4">
        <div class="text-xl font-bold">
          {{ userMovie.movie.title }}
        </div>
        
        <span>
          {{ text }}
        </span>
      </div>
    </div>

    <div class="flex gap-3 items-start justify-between">
      <div class="flex gap-3 items-center rounded rounded-ee-3xl p-1 pe-3 bg-[#7588E1]/10">
        <span class="text-lg">
          😭😂🥰
        </span>

        <span class="text-xs font-medium">
          100%
        </span>
      </div>
      
      <UButton size="lg" color="red" variant="ghost" icon="ic:round-favorite" :ui="{ variant: { ghost: 'dark:hover:bg-red-500/20'}, rounded: 'rounded rounded-es-3xl'}">
        {{ likes }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

defineProps<{
  userMovie: {
    user: {
      nickname: string
    }
    movie: {
      title: string
      posterPath: string
    }
  }
  text: string
  likes: number
}>()

</script>