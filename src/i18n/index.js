import VueI18n from 'vue-i18n';
import Vue from 'vue';
import messages from './distionary.js';

Vue.use(VueI18n);

const usable = ['zh_cn', 'en_gb'];

export default new VueI18n({
  locale: usable[0],
  messages,
  fallbackLocale: usable[1]
});