import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { useSessionStore } from '~/store/session';

export default defineNuxtRouteMiddleware((to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const { user } = storeToRefs(useSessionStore());
  
  const authToken = useCookie<string>('authToken');

  if (authenticated.value && !user.value.id) {
    console.log('Is already authenticated')

    const { createSession } = useSessionStore()
    createSession(authToken.value)
  }

  if (authToken.value) {
    console.log('Is authenticated')
    authenticated.value = true;
  }

  if (authToken.value && to?.name === 'login') {
    console.log('Is already authenticated')
    return navigateTo('/');
  }

  if (!authToken.value && to?.name !== 'login') {
    console.log('Is NOT authenticated')
    abortNavigation();
    return navigateTo('/login');
  }
});