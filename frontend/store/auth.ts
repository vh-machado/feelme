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
        const authToken = useCookie<string>('authToken');

        authToken.value = JSON.stringify(data.value.token);

        const { createSession } = useSessionStore()
        createSession(authToken.value)

        this.authenticated = true;
      }
    },

    logUserOut() {
      const authToken = useCookie<string>('authToken');
      
      const { removeSession } = useSessionStore()
      removeSession()

      this.authenticated = false;
      authToken.value = null;
    }
  },
});