import { defineStore } from 'pinia';

export const useSpotifyStore = defineStore('spotify', {
  state: () => ({
    token: localStorage.getItem('spotify_token') || null,
  }),

  actions: {
    saveToken(token) {
      this.token = token;
      localStorage.setItem('spotify_token', token);
    },

    clearToken() {
      this.token = null;
      localStorage.removeItem('spotify_token');
    },
  },

  getters: {
    isTokenValid: (state) => !!state.token,
  },
});
