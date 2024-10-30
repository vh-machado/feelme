<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
    <UAvatar
      v-if="userStatus !== 'pending'"
      class="ring-[1px] ring-neutral-300/20"
      :src="avatarUri"
      alt="Avatar"
    />
  </UDropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useSessionStore } from '~/store/session'
import { storeToRefs } from 'pinia'

import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
import type { User } from '~/server/models';

const { logUserOut } = useAuthStore()
const sessionStore = useSessionStore(); 
const { user: sessionUser } = storeToRefs(useSessionStore()); 

const userStatus = ref()
const currentUser = ref<User>({ _id: '', name: '', nickname: '', avatar: 'Leo', followers: 0 })

const avatarUri = ref<string>(generateAvatarUri(currentUser.value.avatar))

watch(currentUser, () => {
  avatarUri.value = generateAvatarUri(currentUser.value.avatar)
})

sessionStore.$subscribe(() => {
  fetchUser()

  items.value = [
    [{
      label: sessionUser.value.nickname,
      icon: 'i-mingcute:user-3-fill',
      click: () => {
        navigateTo(`/users/${sessionUser.value.id}`)
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
})

fetchUser()

function generateAvatarUri(avatarSeed: string) {
  const avatar = createAvatar(notionistsNeutral, {
    seed: avatarSeed,
    backgroundColor: ["c0aede", "ADB3DE","d1d4f9"]
  });

  const dataUri = avatar.toDataUri();

  return dataUri
}

const items = ref([
  [{
    label: sessionUser.value.nickname,
    icon: 'i-mingcute:user-3-fill',
    click: () => {
      navigateTo(`/users/${sessionUser.value.id}`)
    }
  }],[{
    label: 'Sair',
    icon: 'i-mingcute:exit-fill',
    click: () => {
      logUserOut()
      navigateTo('/login')
    }
  }]
])

async function fetchUser() {
  const { status } = await useSocialService(`user/${sessionUser.value.id}`, {
    method: 'GET',
    onResponse({ response }) {
      if(response.status === 200) {
        currentUser.value = response._data
      }
    }
  })

  userStatus.value = status
}
</script>