<template>
  <div class="flex flex-col gap-10 w-full lg:w-[950px] items-center justify-self-center px-4 py-8 md:px-0">
    <div v-if="userStatus !== 'pending'" class="flex flex-col gap-5 items-center">
      <UAvatar
        size="3xl"
        class="ring-[1px] ring-neutral-300/50"
        :src="avatarUri"
        alt="Avatar"
      />

      <form class="flex flex-col w-full gap-5" @submit.prevent="updateUser">
        <div class="flex flex-col gap-2 w-full">
          <span class="text-sm font-semibold">Gerar avatar</span>
          
          <UInput v-model="user.avatar" color="gray" variant="outline" placeholder="Avatar" />
        </div>
        
        <div class="flex flex-col gap-2 w-full">
          <span class="text-sm font-semibold">Nome</span>

          <UInput v-model="user.name" color="gray" variant="outline" placeholder="Nome" />
        </div>

        <div class="flex flex-col gap-2 w-full">
          <span class="text-sm font-semibold">Nickname</span>
          
          <UInput v-model="user.nickname" color="gray" variant="outline" placeholder="Nick" />
        </div>
        
        <UButton block type="submit" color="green">Salvar</UButton>

        <UButton block type="button" color="gray" @click="navigateTo(`/users/${route.params.id}`)">Cancelar</UButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

import { createAvatar } from '@dicebear/core';
import { notionistsNeutral } from '@dicebear/collection';
import type { User } from '~/server/models';

const { user: sessionUser } = storeToRefs(useSessionStore()); 

const route = useRoute()

const toast = useToast()
const user = ref<User>({ _id: '', name: '', nickname: '', followers: 0, avatar: '' })

const avatarUri = ref<string>(generateAvatarUri(user.value.avatar))

function generateAvatarUri(avatarSeed: string) {
  const avatar = createAvatar(notionistsNeutral, {
    seed: avatarSeed,
    backgroundColor: ["c0aede", "ADB3DE","d1d4f9"]
  });

  const dataUri = avatar.toDataUri();

  return dataUri
}

watch(user, () => {
  avatarUri.value = generateAvatarUri(user.value.avatar)
}, { deep: true })

const { status: userStatus } = await useSocialService(`user/${route.params.id}`, {
  method: 'GET',
  onResponse({ response }) {
    if(response.status === 200) {
      user.value = response._data
    } else {
      toast.add({ 
        title: 'Não foi possível encontrar usuário!',
        description: response._data.msg,
        color: 'red', 
        icon: 'i-mingcute-unhappy-fill'
      })
    }
  }
})

async function updateUser() {
  await useSocialService(`user/${route.params.id}`, {
    method: 'PUT',
    body: user.value,
    onResponse({ response }) {
      if(response.status === 200) {
        toast.add({ 
          title: 'Usuário atualizado com sucesso!',
          color: 'green', 
          icon: 'i-mingcute-happy-fill'
        })

        sessionUser.value.avatar = user.value.avatar
        sessionUser.value.name = user.value.name
        sessionUser.value.nickname = user.value.nickname

        navigateTo(`/users/${route.params.id}`)
      } else {
        toast.add({ 
          title: 'Não foi possível atualizar usuário!',
          description: response._data.msg,
          color: 'red', 
          icon: 'i-mingcute-unhappy-fill'
        })
      }
    }
  })
}

</script>