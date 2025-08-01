import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/stores/supabase';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true, title: 'Inicio' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Iniciar Sesión' },
  },
  {
    path: '/create-post',
    name: 'create-post',
    component: () => import('@/views/CreatePostView.vue'),
    meta: { requiresAuth: true, title: 'Crear Entrada' },
  },
  {
    path: '/post/:slug',
    name: 'post-detail',
    component: () => import('@/views/PostDeatilView.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Detalle del post' },
  },
  {
    path: '/edit-post/:slug',
    name: 'edit-post',
    component: () => import('@/views/ModifyPostView.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Editar Entrada' },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/CategoriesView.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Categorias' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: { requiresAuth: true, title: 'Favoritos' },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    props: (route) => ({ query: route.query.q || '' }),
    meta: { requiresAuth: true, title: 'Resultados de búsqueda' },
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 - Página no encontrada' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
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
