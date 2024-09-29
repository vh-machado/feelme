<template>
  <div class="flex h-full justify-center gap-4">
    <div class="flex w-full flex-col justify-center items-center gap-4">
      <div class="font-k2d font-bold text-5xl">
        Feel<span class="text-indigo-300">me</span>
      </div>
    </div>

    <UDivider orientation="vertical" :ui="{ border: { base: 'border-slate-600 dark:border-slate-600'} }" />

    <div class="flex w-full flex-col justify-center items-center gap-4 py-4 pe-4">
      <UForm :schema="schema" :state="state" class="w-1/2 space-y-4" @submit="login">
        <UFormGroup label="E-mail" name="email">
          <UInput v-model="state.email" placeholder="E-mail de usuário" size="xl" icon="i-mingcute-at-line" />
        </UFormGroup>

        <UFormGroup label="Senha" name="password">
          <UInput v-model="state.password" placeholder="Senha" type="password" size="xl" icon="i-mingcute-lock-line" />
        </UFormGroup>

        <UButton block type="submit" color="gray" size="lg" class="font-semibold">
          Entrar
        </UButton>
      </UForm>

      <UButton type="submit" block color="green" size="lg" class="w-1/2 font-semibold">
        Criar conta
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticate

const toast = useToast()

const schema = object({
  email: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  password: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

const login = async (event: FormSubmitEvent<Schema>) => {
  await authenticateUser(event.data); // call authenticateUser and pass the user object
  // redirect to homepage if user is authenticated

  if (authenticated.value) {
    toast.add({ title: 'Bem-vindo!', icon: 'i-mingcute-happy-fill' })
    navigateTo('/')
  } else {
    toast.add({ title: 'Informações inválidas', color: 'red', icon: 'i-mingcute-warning-fill' })
  }
};

async function onSubmit (event: FormSubmitEvent<Schema>) {
  const config = useRuntimeConfig()

  await useFetch('auth-service/api/auth/register', {
    baseURL: config.public.gatewayBaseUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: event.data,
    onResponse({ response }) {
      toast.add({ title: `${response.status}: ${response.statusText}` })
      navigateTo('/')
    },
  })
}




</script>