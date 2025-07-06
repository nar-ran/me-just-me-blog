import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/stores/supabase';

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import PostDeatilView from '@/views/PostDeatilView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import CreatePostView from '@/views/CreatePostView.vue';
import CategoriesView from '@/views/CategoriesView.vue';
import FavoritesView from '@/views/FavoritesView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true, title: 'Inicio' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Iniciar Sesión' },
  },
  {
    path: '/post/:slug',
    name: 'post-detail',
    component: PostDeatilView,
    props: true,
    meta: { requiresAuth: true, title: 'Detalle del post' },
  },
  {
    path: '/create-post',
    name: 'create-post',
    component: CreatePostView,
    meta: { requiresAuth: true, title: 'Crear Entrada' },
  },
  {
    path: '/categories/',
    name: 'categories',
    component: CategoriesView,
    props: true,
    meta: { requiresAuth: true, title: 'Categorias' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
    meta: { requiresAuth: true, title: 'Favoritos' },
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '404 - Página no encontrada' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // Modo historial para URLs limpias
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }

  document.title = to.meta.title || 'Me, Just Me';
});

export default router;
