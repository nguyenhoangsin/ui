import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import './styles/index.scss';
import App from './views/App.vue';
import Error404 from './views/Error404.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: 'sol-tracking',
          name: 'SolTracking',
          component: () => import('./views/SolTracking.vue'),
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      name: 'Error404',
      component: Error404,
    },
  ],
});

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .mount('#app');
