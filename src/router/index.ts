import { createRouter, createWebHistory } from 'vue-router';
import PowerStrings from '../views/PowerStrings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'powerstrings',
      component: PowerStrings,
    },
  ],
});

export default router;
