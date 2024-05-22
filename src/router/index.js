import HomeView from '@/views/HomeView.vue';
import ManageView from '@/views/ManageView.vue';
import SongView from '@/views/SongView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from '@/stores/user';

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
