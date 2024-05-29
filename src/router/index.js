import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from '@/stores/user';

const HomeView = () => import('@/views/HomeView.vue');
const ManageView = () => import('@/views/ManageView.vue');
const SongView = () => import('@/views/SongView.vue');

const routes = [
  {
    name: 'home',
    path: '/',
    component: HomeView
  },
  {
    name: 'manage',
    path: '/manage',
    component: ManageView,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: 'songs',
    path: '/songs/:id',
    component: SongView
  },
  {
    path: '/manage-music',
    redirect: { name: 'manage' }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const store = useUserStore();
  if (store.userLoggedIn) {
    next();
    return;
  }

  next({ name: 'home' });
});

export default router;
