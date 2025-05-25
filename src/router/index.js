import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import PostDeatilView from "@/views/PostDeatilView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true, title: "Inicio" },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { title: "Iniciar Sesión" },
  },
  {
    path: "/post/:id",
    name: "post-detail",
    component: PostDeatilView,
    props: true,
    meta: { requiresAuth: true, title: "Detalle del post" },
  },
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: NotFoundView,
    meta: { title: "404 - Página no encontrada" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // Modo historial para URLs limpias
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
    return;
  } else if (to.name === "login" && isAuthenticated) {
    next({ name: "home" });
    return;
  }

  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "Me, Just Me";
  }

  next();
});

export default router;
