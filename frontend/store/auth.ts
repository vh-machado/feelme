import { defineStore } from 'pinia';
//import { useSessionStore } from './session';
//const { setSession } = useSessionStore()

interface UserPayloadInterface {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
  }),

  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface) {
      const body = ref({ email, password })
      const config = useRuntimeConfig()

      const { data, status } = await useFetch('auth-service/api/auth/login', {
        baseURL: config.public.gatewayBaseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
      })

      this.loading = status.value === 'pending'

      if (status.value === 'success') {
        const token = useCookie('token'); // useCookie new hook in nuxt 3

        //setSession({ id: '1', nickname: 'teste' })

        token.value = JSON.stringify(data.value); // set token to cookie
        this.authenticated = true; // set authenticated  state value to true
        console.log(token.value)
      }
    },

    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});