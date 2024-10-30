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

import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
import type { User } from '~/server/models';

const { logUserOut } = useAuthStore()
const sessionStore = useSessionStore(); 

const props = defineProps<{
  userId: string
  userNickname: string
}>()

const userStatus = ref()
const currentUser = ref<User>({ _id: props.userId, name: '', nickname: props.userNickname, avatar: 'Leo', followers: 0 })

const avatarUri = ref<string>(generateAvatarUri(currentUser.value.avatar))

watch(currentUser, () => {
  avatarUri.value = generateAvatarUri(currentUser.value.avatar)
})

sessionStore.$subscribe(() => {
  fetchUser()
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

async function fetchUser() {
  const { status } = await useSocialService(`user/${props.userId}`, {
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