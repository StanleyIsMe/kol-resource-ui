import DashboardLayout from '@/views/Layout/DashboardLayout.vue';
import AuthLayout from '@/views/Pages/AuthLayout.vue';

import NotFound from '@/views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard.vue')
      },
      {
        path: '/icons',
        name: 'icons',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Icons.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/UserProfile.vue')
      },
      {
        path: '/maps',
        name: 'maps',
        component: () => import(/* webpackChunkName: "demo" */ '../views/GoogleMaps.vue')
      },
      {
        path: '/tables',
        name: 'tables',
        component: () => import(/* webpackChunkName: "demo" */ '../views/RegularTables.vue')
      },
      {
        path: '/tags',
        name: 'tags',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Tags.vue')
      },
      {
        path: '/kols',
        name: 'kols',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Kols.vue')
      },
      {
        path: '/products',
        name: 'products',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Products.vue')
      },
      {
        path: '/kols-edit',
        name: 'kols-edit',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/EditKols.vue')
      },
      {
        path: '/products-edit',
        name: 'products-edit',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/EditProducts.vue')
      },
      {
        path: '/email',
        name: 'email',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Email.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: 'login',
    component: AuthLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Pages/Register.vue')
      },
      { path: '*', component: NotFound }
    ]
  }
];

export default routes;
