<template>
  <div class="flex border-b border-slate-600 bg-dark-purple justify-center">
    <div class="flex w-[950px] gap-5 items-center justify-between py-2">
      <ULink to="/" class="font-k2d font-bold text-2xl">
        Feel<span class="text-indigo-300">me</span>
      </ULink>
      
      <UHorizontalNavigation :links="links" class="px-4" :ui="{ active:'dark:after:bg-indigo-300' , before: 'dark:hover:before:bg-neutral-900/20' }">
        <template #default="{ link }">
          <span class="font-semibold group-hover:text-indigo-300 relative">{{ link.label }}</span>
        </template>
      </UHorizontalNavigation>

      <UserDropdown :user-nickname="user.nickname"/>

      <UButton v-if="route.name !== 'reviews-new'" color="green" to="/reviews/new" icon="i-mingcute:quill-pen-ai-fill" :ui="{ rounded: 'rounded-e rounded-s-3xl' } ">
        Escrever crítica
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const { user } = storeToRefs(useSessionStore());

const route = useRoute()

const links = [
  [],
  [{
    label: 'Filmes',
    icon: 'i-mingcute:film-fill',
    to: '/films'
  }, {
    label: 'Críticas',
    icon: 'i-mingcute:message-3-fill',
    to: '/reviews'
  }]
]
</script>