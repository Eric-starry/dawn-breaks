import { constantRoutes, asyncRoutes } from '@/router';
import { cloneDeep } from 'lodash';

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}
// function filterRoutes(routes) {
//   routes.forEach((route, index) => {
//     if (route.hidden) routes.splice(index, 1);
//     if (route.children) {
//       filterRoutes(route.children);
//     }
//   });
//   console.log(routes);
//   return routes;
// }

const state = {
  menuMode: ['horizontal', 'inline'],
  routes: [],
  addRoutes: [],
  headPath: '',
  sidePath: ''
};

const getters = {
  sideMenu: state => {
    let menu = '';
    if (state.menuMode.includes('horizontal') && (state.menuMode.includes('inline') || state.menuMode.includes('vertical'))) {
      let fullMenu =  state.routes.filter(route => {
        let path = route.redirect ? route.redirect : route.path;
        return path === state.headPath;
      });
      menu = fullMenu[0].children ? fullMenu[0].children : [];
    } else if (state.menuMode.includes('inline') || state.menuMode.includes('vertical')) {
      menu = state.routes;
    }
    console.log(menu);
    return menu;
  },
  headMenu: state => {
    if (!state.menuMode.includes('horizontal')) {
      return '';
    }
    return state.routes.map(route => {
      return {
        path: route.path, // route.redirect ? route.redirect : route.path,
        hidden: route.hidden || '',
        meta: route.meta || '',
        name: route.name || '',
        title: route.title || ''
      };
    });
  }
};

const mutations = {
  SET_MENU_MODE: (state, mode) => {
    state.menuMode = mode || ['inline'];
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_HEAD_PATH: (state, path) => {
    state.headPath = path;
  }
};

const actions = {
  generateRoutes({ commit }, roles = []) {
    return new Promise(resolve => {
      let accessedRoutes = [];
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  },
  setMenuMode ({commit}, mode) {
    commit('SET_MENU_MODE', mode);
  },
  setHeadPath ({commit}, path='') {
    commit('SET_HEAD_PATH', path);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};