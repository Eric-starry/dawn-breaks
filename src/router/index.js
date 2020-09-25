import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login/index.vue";
import Layout from "../views/layout/index.vue";
// import Dashboard from '../views/dashboard/index.vue';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    hidden: true,
    component: Login
  },
  {
    path: '/',
    component: Layout,
    name: 'Visualzation',
    cname: '可视化',
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        cname: '仪表板',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      },
      {
        path: "/dashboard/about",
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
        name: "bigscreen",
        cname: '大屏'
      }
    ]
  },
  {
    path: "/dawn",
    component: Layout,
    name: 'Dawn',
    cname: '晨曦初露',
    redirect: '/dawn/index',
    children: [
      {
        path: '/dawn/index',
        component: () => import('../views/dawn/index.vue'),
        name: 'Sketch',
        cname: '简述'
      },
      {
        path: '/dawn/git',
        component: () => import('../views/dawn/git/index.vue'),
        name: 'Git',
        cname: 'Git',
        meta: {
          title: 'git'
        }
      },
      {
        path: '/dawn/vue',
        component: () => import('../views/dawn/vue/index.vue'),
        name: 'Vue',
        cname: 'Vue'
      }
    ]
  },
  {
    path: "/*",
    hidden: true,
    component: () => import('@/views/404/index.vue')
  },
];

export const asyncRoutes = [
  
];


const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

export default router;
