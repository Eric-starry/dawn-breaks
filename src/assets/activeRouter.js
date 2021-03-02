/**
 * 路由配置
 */
import {createRouter, createWebHistory, RouterView} from 'vue-router';
import {createVNode} from 'vue';
import store from '@/store';
import setting from '@/config/setting';
import EleLayout from '@/views/common/layout/Layout';
import NProgress from 'nprogress';

// 静态路由
const routes = [
    {
        path: '/login',
        component: () => import('@/views/login/login'),
        meta: {title: '登录'}
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/exception/404'),
        meta: {title: '404'}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

/* 路由守卫 */
router.beforeEach((to, from, next) => {
    NProgress.start();
    document.title = (to.meta && to.meta.title ? `${to.meta.title} - ` : '') + process.env.VUE_APP_NAME;
    // 判断是否登录
    if (store.state.user.token) {
        // 判断是否已经注册动态路由
        if (!store.state.user.menus) {
            // 获取动态路由
            store.dispatch('user/getMenus').then(({menus, home}) => {
                if (menus) {
                    router.addRoute({
                        path: '/',
                        name: '/',
                        redirect: setting.homePath || home,
                        component: EleLayout,
                        children: menuToRoutes(menus)
                    });
                }
                next({...to, replace: true});
            }).catch(e => {
                console.error(e);
                next();
            });
        } else {
            next();
        }
    } else if (setting.whiteList.indexOf(to.path) !== -1) {
        next();  // 在无需登录的白名单内
    } else {
        // 未登录跳转登录页面
        next({path: '/login', query: to.path === '/' ? {} : {from: to.path}});
    }
});

router.afterEach(() => {
    setTimeout(() => {
        NProgress.done(true);
    }, 300);
});

export default router;

/** 菜单生成路由 */
function menuToRoutes (menus) {
    if (!menus) return;
    let routes = [];
    menus.forEach(item => {
        const path = item.path;
        if (path && !(
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('//')
        )) {
            let component;
            if (item.component) {
                component = () => import('@/views' + item.component );
            } else {
                component = {
                    render () {
                        return createVNode(RouterView);
                    }
                };
            }
            routes.push({
                path: item.path,
                name: item.path,
                redirect: item.redirect,
                meta: item.meta,
                component: component,
                children: menuToRoutes(item.children)
            });
        }
    });
    return routes;
}