import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';

interface UserSessionInterface {
  id: string
  name: string
  nickname: string
  userRole: string
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: <UserSessionInterface> { }
  }),

  actions: {
    createSession(token: string) {
      const jwtToken = JSON.parse(token)
      const decodedData: { [key: string]: { [key: string]: string } } = jwt_decode(jwtToken.token || '') || null;

      this.user = {
        id: decodedData?.user.id,
        name: decodedData?.user.name,
        nickname: decodedData?.user.nickname,
        userRole: decodedData?.user.userRole
      }

      console.log(this.user)
    },

    removeSession() {
      this.user = { } as UserSessionInterface
    },
  },
});