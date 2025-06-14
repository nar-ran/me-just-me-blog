import { defineStore } from 'pinia';
import { supabase } from './supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),

  actions: {
    async login(identificador, password) {
      let email = identificador;
      const username = identificador.trim().toLowerCase();

      if (!identificador.includes('@')) {
        const { data, error } = await supabase.rpc(
          'obtener_email_por_username',
          { input_username: username }
        );

        if (error || !data) {
          return false;
        }

        email = data;
      }

      const { data: sessionData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        return false;
      }

      this.isAuthenticated = true;
      this.user = sessionData.user;

      return true;
    },

    async logout() {
      await supabase.auth.signOut();

      this.isAuthenticated = false;
      this.user = null;
    },

    async checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        this.isAuthenticated = true;
        this.user = data.session.user;
      }
    },
  },
});
