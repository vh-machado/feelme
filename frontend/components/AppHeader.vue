<template>
  <div class="flex border-b border-slate-600 bg-dark-purple justify-center">
    <div class="flex w-[950px] items-center justify-between px-8 py-2">
      <ULink to="/" class="font-k2d font-bold text-2xl">
        Feel<span class="text-indigo-300">me</span>
      </ULink>
      
      <UHorizontalNavigation :links="links" class="px-4" :ui="{ active:'dark:after:bg-indigo-300' , before: 'dark:hover:before:bg-neutral-900/20' }">
        <template #default="{ link }">
          <span class="font-semibold group-hover:text-indigo-300 relative">{{ link.label }}</span>
        </template>
      </UHorizontalNavigation>

      <UButton to="/reviews/new" icon="i-mingcute:quill-pen-ai-fill">
        Escrever crítica
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAuthStore } from '~/store/auth'
import { useSessionStore } from '~/store/session'

const { logUserOut } = useAuthStore()
const { user } = storeToRefs(useSessionStore());

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
  }, {
    label: user.value.nickname,
    avatar: { src: 'https://avatars.githubusercontent.com/u/73856054?v=4' }
  }, {
    label: 'Logout',
    to: '/login',
    click: logUserOut
  }]
]
</script>