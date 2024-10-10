import { defineStore } from 'pinia';

import { useSessionStore } from './session';

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
        const token = useCookie('token');

        token.value = JSON.stringify(data.value);

        const { createSession } = useSessionStore()
        createSession(token.value)

        this.authenticated = true;
      }
    },

    logUserOut() {
      const token = useCookie('token');
      
      const { removeSession } = useSessionStore()
      removeSession()

      this.authenticated = false;
      token.value = null;
    }
  },
});