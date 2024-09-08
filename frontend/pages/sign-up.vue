<template>
  <div class="flex justify-center py-8">
    <div class="flex w-[950px] justify-center">
      <UForm :schema="schema" :state="state" class="w-1/2 space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup label="Nickname" name="nickname">
          <UInput v-model="state.nickname" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const schema = object({
  name: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  nickname: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  email: string()
    .email('Invalid email')
    .required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive({
  name: undefined,
  nickname: undefined,
  email: undefined,
  password: undefined
})

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

const toast = useToast()

</script>