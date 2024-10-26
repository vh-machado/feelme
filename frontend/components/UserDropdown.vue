<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
    <UAvatar
      class="ring-[1px] ring-neutral-400"
      :src="dataUti"
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
  userNickname: string
}>()

const avatar = createAvatar(notionistsNeutral, {
  seed: 'Feelme',
  backgroundColor: ["b6e3f4","c0aede","d1d4f9"]
});

const dataUti = await avatar.toDataUri(); 

const items = [
  [{
    label: props.userNickname,
    icon: 'i-mingcute:user-3-fill'
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