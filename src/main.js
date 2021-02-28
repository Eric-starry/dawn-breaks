import Vue from "vue";
import Antd from 'ant-design-vue';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from './i18n/index.js';
import 'ant-design-vue/dist/antd.css';
import './styles/index.scss';
import './utils/menuConfig.js';

Vue.config.productionTip = false;

Vue.use(Antd);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
