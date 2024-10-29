<template>
  <div class="flex border-b border-slate-600 bg-dark-purple justify-center">
    <div class="flex flex-col lg:flex-row w-[950px] gap-2 lg:gap-5 lg:items-center justify-between p-4 lg:px-0 lg:py-2">
      <ULink to="/" class="flex items-center gap-4 font-k2d font-bold text-2xl">
        <img src="/assets/feelme-logo.png" class="h-5 ">
        
        <div>
          Feel<span class="text-indigo-300">me</span>
        </div>
      </ULink>
      
      <div class="flex items-center justify-between lg:gap-4 lg:justify-end">
        <UHorizontalNavigation :links="links" class="px-4" :ui="{ wrapper: 'hidden lg:flex', active:'dark:after:bg-indigo-300' , before: 'dark:hover:before:bg-neutral-900/20' }">
          <template #default="{ link }">
            <span class="font-semibold group-hover:text-indigo-300 relative">{{ link.label }}</span>
          </template>
        </UHorizontalNavigation>

        <UHorizontalNavigation :links="linksMobile" :ui="{ base:'p-2', wrapper: 'justify-start lg:hidden', active:'dark:after:bg-indigo-300' , before: 'dark:hover:before:bg-neutral-900/20' }">
          <template #default="{ link }">
            <span class="font-semibold group-hover:text-indigo-300 relative">{{ link.label }}</span>
          </template>
        </UHorizontalNavigation>
        
        <UserDropdown :user-id="user.id" :user-nickname="user.nickname"/>
        
        <div class="hidden lg:flex w-full">
          <UButton v-if="route.name !== 'reviews-new'" color="green" to="/reviews/new" icon="i-mingcute:quill-pen-ai-fill" :ui="{ rounded: 'rounded-e rounded-s-3xl' } ">
            Escrever crítica
          </UButton>
        </div>
      </div>
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

const linksMobile = [
  [{
    label: 'Filmes',
    icon: 'i-mingcute:film-fill',
    to: '/films'
  }, {
    label: 'Críticas',
    icon: 'i-mingcute:message-3-fill',
    to: '/reviews'
  }]
  ,[]
]
</script>