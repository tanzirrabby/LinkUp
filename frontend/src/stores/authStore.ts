export type AuthUser = { id: string; username: string; displayName: string };

let accessToken = '';
let currentUser: AuthUser | null = null;

export const authStore = {
  get token() {
    return accessToken;
  },
  setToken(token: string) {
    accessToken = token;
  },
  get user() {
    return currentUser;
  },
  setUser(user: AuthUser | null) {
    currentUser = user;
  }
};
