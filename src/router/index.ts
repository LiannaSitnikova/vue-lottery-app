import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import AuthLayout from '../layouts/AuthLayout.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { title: 'Головна' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: { title: 'Про автора' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/UsersView.vue'),
        meta: { requiresAuth: true, title: 'Користувачі' },
      },
      {
        path: 'users/:id',
        name: 'user-detail',
        component: () => import('../views/UserDetailView.vue'),
        props: true,
        meta: { requiresAuth: true, title: 'Деталі користувача' },
      },
      {
        path: 'users/:id/edit',
        name: 'user-edit',
        component: () => import('../views/UserEditView.vue'),
        props: true,
        meta: { requiresAuth: true, title: 'Редагувати користувача' },
      },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { title: 'Авторизація' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '404 - Сторінку не знайдено' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return next({ name: 'users' });
  }

  next();
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} | Lottery App`;
  }
});

export default router;