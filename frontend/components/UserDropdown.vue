<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
    <UAvatar
      class="ring-[1px] ring-neutral-300/50"
      :src="dataUri"
      alt="Avatar"
    />
  </UDropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';

const { logUserOut } = useAuthStore()

const props = defineProps<{
  userId: string
  userNickname: string
}>()

const avatar = createAvatar(notionistsNeutral, {
  seed: 'Feelme',
  backgroundColor: ["b6e3f4","c0aede","d1d4f9"]
});

const dataUri = await avatar.toDataUri(); 

const items = [
  [{
    label: props.userNickname,
    icon: 'i-mingcute:user-3-fill',
    click: () => {
      navigateTo(`/users/${props.userId}`)
    }
  }],[{
    label: 'Sair',
    icon: 'i-mingcute:exit-fill',
    click: () => {
      logUserOut()
      navigateTo('/login')
    }
  }]
]
</script>