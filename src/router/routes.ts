import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'board',
        component: () => import('pages/board/BoardPage.vue'),
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: () => import('pages/analytics/AnalyticsPage.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/settings/SettingsPage.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/profile/ProfilePage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
