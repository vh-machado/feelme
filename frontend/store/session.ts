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
    createSession(authToken: string) {
      const decodedData: { 
        [key: string]: { [key: string]: string } 
      } = jwt_decode(authToken || '') || null;

      this.user = {
        id: decodedData?.user.id,
        name: decodedData?.user.name,
        nickname: decodedData?.user.nickname,
        userRole: decodedData?.user.userRole
      }
    },

    removeSession() {
      this.user = { } as UserSessionInterface
    },
  },
});