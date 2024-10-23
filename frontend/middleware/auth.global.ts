import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to) => {
  const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
  const token = useCookie('authToken'); // get token from cookies

  if (token.value) {
    // check if value exists
    console.log('Is authenticated')
    authenticated.value = true; // update the state to authenticated
  }

  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === 'login') {
    console.log('Is already authenticated')
    return navigateTo('/');
  }

  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== 'login') {
    console.log('Is NOT authenticated')
    abortNavigation();
    return navigateTo('/login');
  }
});