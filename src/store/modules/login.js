const state = {
  token: '',
  login: false,
  lang: null
};

const getters = {
  getToken: state => {
    return state.token;
  },
  getLogin: state => {
    return state.login;
  }
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_LOGIN: (state, login) => {
    state.login = login;
  },
  setLang: (state, lang) => {
    state.lang = lang;
  }
};

const actions = {
  setToken: ({commit}, val = '') => {
    commit('SET_TOKEN', val);
  },
  setLogin: ({commit}, val = false) => {
    commit('SET_LOGIN', val);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};