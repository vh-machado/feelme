<template>
  <div class="flex h-full justify-center gap-4">
    <div class="flex w-full flex-col justify-center items-center gap-4">
      <div class="font-k2d font-bold text-5xl">
        Feel<span class="text-indigo-300">me</span>
      </div>
    </div>

    <UDivider orientation="vertical" :ui="{ border: { base: 'border-slate-600 dark:border-slate-600'} }" />

    <div class="flex w-full flex-col justify-center items-center gap-4 py-4 pe-4">
      <div v-if="formMode === 'none'" class="flex w-1/2 flex-col justify-center items-center gap-4">
        <UButton block type="button" color="green" size="lg" class="font-semibold" @click="formMode = 'register'">
          Começar agora
        </UButton>
        
        <UButton block type="submit" color="gray" size="lg" class="font-semibold" @click="formMode = 'login'">
          Entrar
        </UButton>
      </div>
        
      <UForm v-if="formMode === 'login'" :schema="loginSchema" :state="loginState" class="w-1/2 space-y-4" @submit="login">
        <UFormGroup label="E-mail" name="email">
          <UInput v-model="loginState.email" placeholder="E-mail de usuário" size="xl" icon="i-mingcute-at-line" />
        </UFormGroup>

        <UFormGroup label="Senha" name="password">
          <UInput v-model="loginState.password" placeholder="Senha" type="password" size="xl" icon="i-mingcute-lock-line" />
        </UFormGroup>

        <UButton block type="submit" color="green" size="lg" class="font-semibold">
          Entrar
        </UButton>

        <UButton block type="button" color="gray" size="lg" class="font-semibold" @click="formMode = 'register'">
          Não possuo conta
        </UButton>
      </UForm>

      <UForm v-if="formMode === 'register'" :schema="registerSchema" :state="registerState" class="w-1/2 space-y-4" @submit="register">
        <UFormGroup label="Nome" name="name">
          <UInput v-model="registerState.name" placeholder="Seu nome" size="xl" icon="i-mingcute-user-3-fill" />
        </UFormGroup>

        <UFormGroup label="Nickname" name="nickname">
          <UInput v-model="registerState.nickname" placeholder="Seu apelido" size="xl" icon="i-mingcute-happy-fill" />
        </UFormGroup>

        <UFormGroup label="E-mail" name="email">
          <UInput v-model="registerState.email" placeholder="E-mail de usuário" size="xl" icon="i-mingcute-at-line" />
        </UFormGroup>

        <UFormGroup label="Senha" name="password">
          <UInput v-model="registerState.password" placeholder="Senha" type="password" size="xl" icon="i-mingcute-lock-line" />
        </UFormGroup>

        <UFormGroup label="Confirmar senha" name="passwordConfirmation">
          <UInput v-model="registerState.passwordConfirmation" placeholder="Confirmar senha" type="password" size="xl" icon="i-mingcute-lock-line" />
        </UFormGroup>

        <UButton block type="submit" color="green" size="lg" class="font-semibold">
          Criar conta
        </UButton>

        <UButton block type="button" color="gray" size="lg" class="font-semibold" @click="formMode = 'login'">
          Já possuo conta
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

const { authenticateUser } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore());

const toast = useToast()

const formMode = ref<'none' | 'login' | 'register'>('none')

const loginSchema = object({
  email: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  password: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required')
})

const registerSchema = object({
  name: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  nickname: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  email: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  password: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required'),
  passwordConfirmation: string()
    .min(3, 'Must be at least 3 characters')
    .required('Required')
})

type LoginSchema = InferType<typeof loginSchema>
type RegisterSchema = InferType<typeof registerSchema>

const loginState = reactive({
  email: undefined,
  password: undefined
})

const registerState = reactive({
  name: undefined,
  nickname: undefined,
  email: undefined,
  password: undefined,
  passwordConfirmation: undefined
})

const login = async (event: FormSubmitEvent<LoginSchema>) => {
  await authenticateUser(event.data);

  if (authenticated.value) {
    toast.add({ title: 'Bem-vindo(a)!', icon: 'i-mingcute-happy-fill' })
    navigateTo('/')
  } else {
    toast.add({ title: 'Informações inválidas', color: 'red', icon: 'i-mingcute-unhappy-fill' })
  }
};

const register = async (event: FormSubmitEvent<RegisterSchema>) => {
  await useAuthService('register', {
    method: 'POST',
    body: event.data,
    onResponse({ response }) {
      if(response.status === 200) {
        login(event)
      } else {
        toast.add({ 
          title: 'Não foi possível criar a conta!',
          description: response._data.msg,
          color: 'red', 
          icon: 'i-mingcute-unhappy-fill'
        })
      }
    }
  })
};

</script>