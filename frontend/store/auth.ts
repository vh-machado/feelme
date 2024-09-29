
import { defineStore } from 'pinia';

interface UserPayloadInterface {
  nickname: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
  }),

  actions: {
    async authenticateUser({ nickname, password }: UserPayloadInterface) {
      // const { data, pending }: any = await useFetch('apiurl', {
      //   method: 'post',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: {
      //     username,
      //     password,
      //   },
      // });
      // this.loading = pending;

      const data = ref({
        user: 'john'
      })

      this.loading = false

      if (data.value) {
        const token = useCookie('token'); // useCookie new hook in nuxt 3
        token.value = JSON.stringify(data?.value); // set token to cookie
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