import DashboardLayout from '@/views/Layout/DashboardLayout.vue';
import AuthLayout from '@/views/Pages/AuthLayout.vue';
import NotFound from '@/views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { requiresAuth: true, hideFooter: true },
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: '/tags',
        name: 'tags',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/Tags.vue')
      },
      {
        path: '/kols',
        name: 'kols',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/Kols.vue')
      },
      {
        path: '/products',
        name: 'products',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/Products.vue')
      },
      {
        path: '/kols-edit',
        name: 'kols-edit',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/EditKols.vue')
      },
      {
        path: '/products-edit',
        name: 'products-edit',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/EditProducts.vue')
      },
      {
        path: '/email',
        name: 'email',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/Email.vue')
      },
      {
        path: '/email-senders',
        name: 'email-senders',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/EmailSenders.vue')
      },
      {
        path: '/email-jobs',
        name: 'email-jobs',
        meta: { requiresAuth: true },
        component: () => import('../views/Pages/EmailJobs.vue')
      }
    ]
  },
  {
    path: '/auth',
    redirect: '/login',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/Pages/Login.vue')
      }
    ]
  },
  { path: '*', component: NotFound }
];

export default routes;
