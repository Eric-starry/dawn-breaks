import router from '../router/index.js';
import store from '../store/index.js';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/404', '/redirect']; // no redirect whitelist
const menuMode = ['inline'];
store.dispatch('menu/setMenuMode', menuMode);
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const token = store.getters['login/getToken'];
  console.log('to----------------', to);
  console.log('from--------------', from);
  if (!token) {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next({path: '/login', replace: true});
    }
  } else {
    if (menuMode.includes('horizontal')) {
      store.dispatch('menu/setHeadPath', to.path);
    }
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      try {
        if (from.path === '/login') {
          const accessRoutes = await store.dispatch('menu/generateRoutes', ['admin']);
          router.addRoutes(accessRoutes);
        }
        next();
      } catch (err) {
        console.log('err---------------', err);
        next('/login');
      }
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});