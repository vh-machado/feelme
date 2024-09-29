import { defineStore } from 'pinia';

interface UserSessionInterface {
  id: string
  nickname: string
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: { }
  }),

  actions: {
    setSession(user: UserSessionInterface) {
      this.user = { ...user }
    },

    removeSession() {
      this.user = { }
    },
  },
});