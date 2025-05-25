import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    token: null,
  }),

  actions: {
    async login(username, password) {
      if (username.toLowerCase() === "flowernkl" && password == "134340") {
        this.isAuthenticated = true;
        this.user = { username: this.username, role: "admin" };

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(this.user));

        await new Promise((resolve) => setTimeout(resolve, 500));
        return true;
      } else {
        console.error("Login provisional fallido: Credenciales incorrectas.");
        return false;
      }

      // // Login con el back :D
      // try {
      //   const response = await fetch("/api/login", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ username, password }),
      //   });

      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || "Error de autenticación");
      //   }

      //   const data = await response.json();
      //   this.isAuthenticated = true;
      //   this.user = data.user;

      //   return true;
      // } catch (e) {
      //   console.error("Error al iniciar sesión");
      //   this.isAuthenticated = false;
      //   this.user = null;
      //   return false;
      // }
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");

      // --- Cuando tenga el backend, ESTA LÓGICA REEMPLAZARÁ la provisional ---
      // await fetch('/api/logout', { method: 'POST' }); // Llamada al backend para invalidar sesión
      //   this.isAuthenticated = false;
      //   this.user = null;
      // Eliminar el token de acceso de memoria
    },
  },
  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  },
});
