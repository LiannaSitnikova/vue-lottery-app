import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '@/entities/session';
import DefaultLayout from '@/app/layouts/DefaultLayout.vue';
import AuthLayout from '@/app/layouts/AuthLayout.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/home/ui/HomeView.vue'),
        meta: { title: 'Головна' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/pages/about/ui/AboutView.vue'),
        meta: { title: 'Про автора' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/users/ui/UsersView.vue'),
        meta: { requiresAuth: true, title: 'Користувачі' },
      },
      {
        path: 'users/:id',
        name: 'user-detail',
        component: () => import('@/pages/user-detail/ui/UserDetailView.vue'),
        props: true,
        meta: { requiresAuth: true, title: 'Деталі користувача' },
      },
      {
        path: 'users/:id/edit',
        name: 'user-edit',
        component: () => import('@/pages/user-edit/ui/UserEditView.vue'),
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
        component: () => import('@/pages/login/ui/LoginView.vue'),
        meta: { title: 'Авторизація' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/ui/NotFoundView.vue'),
    meta: { title: '404 - Сторінку не знайдено' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const sessionStore = useSessionStore();
  
  if (to.meta.requiresAuth && !sessionStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.name === 'login' && sessionStore.isAuthenticated) {
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