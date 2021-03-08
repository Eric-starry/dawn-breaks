import 'proxy-polyfill/proxy.min.js';
import 'core-js/stable';
import Vue from 'vue';
import user from 'PAGES/userAdmin/userModel';
import {
  mapState,
  mapActions
} from 'vuex';
import license from 'COMPONENTS/nolicense/model';
import menuModel from 'UTIL/_menuModel';
import clickOutside from 'UTIL/clickOutside.js';
import schemas from 'UTIL/schemas';
import urls from 'UTIL/urls';
import trans from 'UTIL/trans';
import http from 'UTIL/http';
import helper from 'UTIL/helper';
import handlers from 'UTIL/handlers';
import httpmw from '@qnpm/httpmw';
import VueRx from 'vue-rx';
import Rx from 'rxjs/Rx';
import Promise from 'bluebird';
import appGlobal from 'COMMONS/global';

import ElementUI from 'element-ui';
import './commons/theme/elementui/element.theme.css';

import 'COMMONS/style.less';
import 'COMMONS/app-fonts/el-iconfont/iconfont.css';

import smartEF from '@vislab/smart-ef';
import VueSmartEF from '@vislab/vue-smart-ef';

import {
  exportCsv
} from 'UTIL/exportCsv';

import ElTreeSelect from 'COMMONS/components/elTreeSelect/elTreeSelect.vue'; // 基于element 封装树形复选框
import {
  json
} from 'd3';
import sdkAgent from '../skyeyeSDK/modules/agent';
import skyeyeSDK from '../skyeyeSDK/index';
import fdx from './fdx';
import i18n from './i18n';
import routeConfig from './router/routeConfig';
import store from './vuex';
import router from './router';
import App from './App.vue';

let isDevEnv = process.env.NODE_ENV === 'development';

Promise.config({
  warnings: !!isDevEnv
});

http.intercept();
httpmw.schemas.set(schemas);
httpmw.urls.set(urls);
httpmw.trans.set(trans);
httpmw.setConfig({
  debug: isDevEnv
});

Vue.use({
  install: function (Vue) {
    Vue.prototype.$exportCsv = exportCsv;
  }
});

Vue.use({
  install: function (Vue) {
    let vue = new Vue();
    Vue.prototype.$bus = vue;
    Vue.bus = vue;
  }
});

Vue.use(ElementUI);
Vue.use(VueSmartEF, smartEF);
Vue.use(skyeyeSDK);
Vue.component('ElTreeSelect', ElTreeSelect);
Vue.use(VueRx, Rx);
Vue.directive('clickoutside', clickOutside);

function create (err, data, licenseInfo) {
  return new Vue({
    el: '#app',
    store,
    router,
    i18n,
    fdata: fdx,
    components: {
      App
    },
    data: {
      esInfo: []
    },
    template: '<App/>',
    computed: {
      ...mapState({
        user: state => state.user,
        pageAuthority: state => state.pageAuthority,
        license: state => state.license,
        authorityList: state => state.authorityList
      })
    },
    mounted () {
      if (err) {
        user.getCaptchaUrl();
        appGlobal.preReqUrl = `${window.location.pathname.replace(appGlobal.base, '')}${window.location.search}`;
        this.$router.push('/login');
        err.data && err.data.data && this.updateuser({
          'copyright': err.data.data.copyright,
          'homepagetitle': err.data.data.homepagetitle
        });
        err.licenseInfo && this.updatechannelversion({
          user_unit: err.licenseInfo.user_unit,
          remain: err.licenseInfo.remain || '0天',
          type: err.licenseInfo.type,
          license_type: err.licenseInfo.license_type,
          agency_version: err.licenseInfo.agency_version,
          otime: err.licenseInfo.otime,
          product_serial: err.licenseInfo.product_serial,
          sale: err.licenseInfo.sale,
          sale_phone: err.licenseInfo.sale_phone,
          version: err.licenseInfo.version
        });
        err.noahInfo && this.updateuser({
          noahStatus: err.noahInfo
        });
        return;
      }
      data.licenseInfo && this.updatechannelversion({
        user_unit: data.licenseInfo.user_unit,
        remain: data.licenseInfo.remain || '0天',
        type: data.licenseInfo.type,
        license_type: data.licenseInfo.license_type,
        agency_version: data.licenseInfo.agency_version,
        otime: data.licenseInfo.otime,
        product_serial: data.licenseInfo.product_serial,
        sale: data.licenseInfo.sale,
        sale_phone: data.licenseInfo.sale_phone,
        version: data.licenseInfo.version
      });

      this.updateuser({
        'copyright': data.copyright,
        'homepagetitle': data.homepagetitle
      });
      this.updateuser({
        uid: data.uid,
        username: data.username,
        isAdmin: data.admin,
        changePwd: data.change_password,
        changePwdMsg: data.change_password_message,
        type: data.type,
        secret: data.secret,
        ti: data.Ti,
        Ti: data.Ti,
        is_alarm_warn: data.is_alarm_warn,
        noahStatus: data.noahInfo
      });

      // 非三权分立或系统管理员用户
      if (!this.user.secret || this.user.type === 4 || this.user.type === 6) {
        user.getEsInfo()
          .then((resp) => {
            if (resp.message && resp.message !== 'ES配置成功') {
              this.$message({
                message: resp.message,
                type: 'warning'
              });
            }
          })
          .catch(error => this.$message({
            message: error.error && error.error.message || 'ES初始化异常',
            type: 'error'
          }));
        user.getEsAlarm()
          .then(info => {
            info.flag && this.$message({
              message: info.message,
              type: 'error'
            });
          });
      }

      if (licenseInfo.length !== 0) {
        licenseInfo.forEach(el => {
          setTimeout(() => this.$message({
            message: el.message,
            type: el.type
          }), 500);
        });
      }

      if (this.user.changePwd) {
        this.showModifyPswModal();
        this.$message({
          message: this.user.changePwdMsg,
          type: 'warning'
        });
      } else if (this.user.changePwdMsg && this.user.changePwdMsg != '不用修改密码') {
        this.$message({
          message: this.user.changePwdMsg,
          type: 'warning'
        });
      }
    },
    methods: {
      ...mapActions({
        updateuser: 'updateuser',
        updatechannelversion: 'updatechannelversion',
        toggleModifyPswModal: 'login/toggleModifyPswModal'
      }),
      showModifyPswModal () {
        this.toggleModifyPswModal(true);
      }
    }
  });
}

/**
 * 获取第三方日志安装状态
 */
async function getThirdLogStatus () {
  let thirdLogStatus = {};
  try {
    let noahRes = await http.get('/config/get_third_log_status');
    thirdLogStatus = {
      deployStatus: noahRes.items.deploy_status,
      switchStatus: noahRes.items.switch_status
    };
  } catch (e) {
    console.error(e);
    thirdLogStatus = {
      deployStatus: 0,
      switchStatus: 0
    };
  }
  return thirdLogStatus;
}

const run = async function () {
  try {
    let params = helper.getUrlParams(window.location.href);
    let jumpLogin = false;
    if (params.free_login_token) {
      await http.get('/admin/auth?token=' + params.free_login_token)
        .catch(error => {
          if (error && error.status == '401') {
            jumpLogin = false;
          } else {
            jumpLogin = true;
            let searchParamsArr = [];
            Object.keys(params).forEach(el => {
              if (el != 'free_login_token') {
                searchParamsArr.push(el + '=' + params[el]);
              }
            });
            window.location.search = '?' + searchParamsArr.join('&');
          }
        });
    }
    if (!jumpLogin) {
      const res = await user.checkLogin(params && params.bigscreen ? {
        bigscreen: params.bigscreen
      } : {});
      if (res.status == 200) {
        if (window.location.pathname.includes('skyeye/home/login')) {
          window.location.href = location.origin + '/skyeye/home';
          return false;
        }
      }
      const data = res.data;
      const lres = await license.getInfo();
      const licenseInfo = lres.arr;
      let lice2 = await http.get('/admin/channel_version');
      let channelLicense = {
        licenseInfo: {
          ...lice2.data.license_info
        }
      };
      let noahInfo = {
        noahInfo: await getThirdLogStatus()
      };
      let dataAll = Object.assign(data, channelLicense, noahInfo);
      await menuModel.start(router, sdkAgent);
      return create(false, dataAll, licenseInfo);
    }
  } catch (err) {
    let lice2 = await http.get('/admin/channel_version');
    let channelLicense = {
      licenseInfo: {
        ...lice2.data.license_info
      }
    };
    let noahInfo = {
      noahInfo: await getThirdLogStatus()
    };
    let errData = Object.assign(err, channelLicense, noahInfo);
    create(errData);
  }
};

window.onload = () => {
  run();
};
