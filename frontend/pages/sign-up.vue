<template>
  <div class="flex justify-center py-8">
    <div class="flex w-[950px] justify-center">
      <UForm :schema="schema" :state="state" class="w-1/2 space-y-4" @submit="onSubmit">
        <UFormGroup label="Nickname" name="nickname">
          <UInput v-model="state.nickname" size="xl" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="passwordConfirm">
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

const toast = useToast()

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
  nickname: undefined,
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




</script>