<template>
  <div class="flex border-b border-gray-200 dark:border-gray-800 items-center p-2">
    <ULink to="/" class="px-4 font-k2d font-bold text-2xl">
      Feel<span class="text-indigo-300">me</span>
    </ULink>
    
    <UHorizontalNavigation :links="links" class="px-4">
      <template #default="{ link }">
        <span class="font-semibold group-hover:text-indigo-300 relative">{{ link.label }}</span>
      </template>
    </UHorizontalNavigation>
  </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/store/auth'

const { logUserOut } = useAuthStore()
const { authenticated } = storeToRefs(useAuthStore())

const links = [
  [{
    label: 'Filmes',
    icon: 'i-mingcute:film-fill',
    to: 'films'
  }, {
    label: 'Críticas',
    icon: 'i-mingcute:message-3-fill',
    to: 'reviews'
  }], [{
    label: 'User',
    avatar: { src: 'https://avatars.githubusercontent.com/u/73856054?v=4' }
  }, {
    label: 'Logout',
    to: 'login',
    click: logUserOut
  }]
]
</script>