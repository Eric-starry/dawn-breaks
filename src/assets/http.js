import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import global from 'COMMONS/global';
import router from '../router';

let isDev = process.env.NODE_ENV === 'development';

// 进度条
nprogress.configure({
  showSpinner: false,
  trickleRate: 0.01,
  trickleSpeed: 100
});

axios.defaults.baseURL = global.baseRequestUri;

let queue = []; // 查询队列
let Http = {
  get csrfToken () {
    if(this._csrfToken){
      return localStorage.getItem('csrf_token');
    }else
      return document.querySelector('meta[name=csrf-token]').content;
  },
  set csrfToken (value) {
    localStorage.setItem('csrf_token', value);
    this._csrfToken = value;
  },
  complete () {
    queue.pop();
    if (queue.length === 0) {
      nprogress.done();
    }
  },
  intercept () {
    let _this = this;
    axios.interceptors.request.use(function (config) {
      queue.push(config.url);
      nprogress.start();
      let _obj = {
        csrf_token: _this.csrfToken,
        r: Math.random()
      };
      if (config.form) {
        let _data = config.data;
        if (_data) {
          config.data = `${_.isString(_data) ? _data : qs.stringify(_data, {indices: config.traditional ? false : true})}&${qs.stringify(_obj)}`;
        } else {
          config.data = `${qs.stringify(_obj)}`;
        }
      } else {
        if (config.method === 'get') {
          if (!config.params) {
            config.params = _obj;
          } else {
            Object.assign(config.params, _obj);
          }
        } else {
          if (!config.data) {
            config.data = _obj;
          } else {
            Object.assign(config.data, _obj);
          }
        }
      }
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
      _this.complete();
      return _this.respSucHandle(response);
    }, function (error) {
      return _this.respErrHandle(error);
    });
  },

  respSucHandle (response) {
    let _this = this;
    let data = response.data;
    if(data.data && data.data.token){
      _this.csrfToken = data.data.token;
    }
    if(data.error && data.error.token) {
      _this.csrfToken = data.error.token;
    }
    if(data.data && data.data.status && (data.data.status === 200 || data.data.status === 1000)) {
      return Promise.resolve(data.data);
    }else if(data.data && data.data.status && data.data.status === 401) {
      if(!response.config.url.includes('/admin/login') && !response.config.url.includes('/admin/logout')) {
        return new Promise((resolve, reject) => {
          global.preReqUrl =  `${window.location.pathname.replace(global.base, '')}${window.location.search}`;
          global.errorFlag = 1;
          router.push({path: '/login'});
        });
      }
    }else if(data.error && [200, 201, 204].includes(response.status)) {
      return Promise.reject(data);
    }else if(['post', 'put', 'delete'].includes(response.config.method.toLowerCase()) && [200, 201, 204].includes(response.status)) {
      return Promise.resolve(data.data ?  data.data : ''); // ''
    } else {
      return Promise.reject(data);
    }
  },

  respErrHandle (error) {
    let _this = this;
    if(error && error.response && error.response.data && error.response.data.error && error.response.data.error.token) {
      _this.csrfToken = error.response.data.error.token;
    }
    if(error && error.response ) {
      let response = error.response;
      if(response && response.status) {
        switch(response.status) {
          case 401:
            if(!response.config.url.includes('/admin/login') &&
                !response.config.url.includes('/admin/logout') &&
                  !response.config.url.includes('/system/config/get_license_info')) {
              return new Promise((resolve, reject) => {
                global.preReqUrl = `${window.location.pathname.replace(global.base, '')}${window.location.search}`;
                global.errorFlag = 1;
                router.push({path: '/login'});
              });
            }else {
              return Promise.reject(response.data ? response.data : response);
            }
            break;
          case 302:
            location.reload();
            break;
          default:
            return Promise.reject(response.data ? ((respData) => {
              if(respData.error && respData.error.message && _.isObject(respData.error.message)) {
                return {error: { message: isDev ? JSON.stringify(respData.error.message) : ''}};
              }
              return respData;
            })(response.data) : response);
        }
      }
    }else{
      return Promise.reject(error);
    }
  },

  /**
   * 用于下载文件
   * @param url
   * @param name
   */
  download (url, name = '', isFullUrl = false) {
    url = isFullUrl ? url : (global.baseRequestUri + url);
    let link = document.createElement('a');
    link.setAttribute('download', name);
    link.setAttribute('href', url);
    Object.assign(link.style, {
        opacity: 0,
        position: 'absolute',
        top: 0
    });
    document.body.appendChild(link);
    link.click();
    setTimeout(() => document.body.removeChild(link), 2000);
  },

  /**
   * 用于POST下载文件 @param options: { url: '',data: '' }
   */
  downloadByPost (options) {
    let $ = window.$;
    var config = $.extend(true, { method: 'post' }, options);
    var $iframe = $('<iframe id="down-file-iframe" />');
    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
      $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    $form[0].submit();
    $iframe.remove();
  },

  upload: function (url, file, params) {
      url = global.baseRequestUri + url;
      let self = Http;
      return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          let formData = new FormData();
          formData.append('csrf_token', self.csrfToken);
          formData.append('fp', file);
          if (params) {
              for (let i in params) {
                  if (params.hasOwnProperty(i)) {
                      formData.append(i, params[ i ]);
                  }
              }
          }
          xhr.open('POST', url);
          xhr.onerror = function error (e) {
            reject(e);
          };
          xhr.onload = function () {
            let res = xhr.responseText || xhr.response;
            if (![200, 201, 204].includes(xhr.status) || xhr.status >= 300) {
              if([404, 502].includes(xhr.status)) {
                reject({error: { message: isDev ? xhr.status : ''}});
              }
              try{
                let resData = JSON.parse(res);
                if(resData.error && resData.error.token) {
                  self.csrfToken = resData.error.token;
                }
                if(resData.error && resData.error.message && _.isObject(resData.error.message)) {
                  reject({error: { message: isDev ? JSON.stringify(resData.error.message) : ''}});
                }else
                  reject(resData);
              }catch(e){
                reject(xhr);
              }
            }
            if(!res) {
              resolve(res);
            }
            try {
              let resData = JSON.parse(res);
              if(resData.token){
                self.csrfToken = resData.token;
              }
              if(resData.data && resData.data.token) {
                self.csrfToken = resData.data.token;
              }
              resolve(resData);
            } catch (e) {
              resolve(res);
            }
          };
          xhr.send(formData);
      });
  },

  elUpload: (option) => {
    let self = Http;
    if (typeof XMLHttpRequest === 'undefined') {
      return;
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const action = global.baseRequestUri + option.action;
      if (xhr.upload) {
        xhr.upload.onprogress = function progress (e) {
          if (e.total > 0) {
            e.percent = e.loaded / e.total * 100;
          }
          option.onProgress(e);
        };
      }
      const formData = new FormData();
      formData.append('csrf_token', self.csrfToken);
      if (option.data) {
        Object.keys(option.data).forEach(key => {
          formData.append(key, option.data[key]);
        });
      }
      formData.append(option.filename || 'fp', option.file, option.file.name);
      xhr.onerror = function error (e) {
        reject(e);
      };
      xhr.onload = function onload () {
        let res = xhr.responseText || xhr.response;
        if (![200, 201, 204].includes(xhr.status) || xhr.status >= 300) {
          if([404, 502].includes(xhr.status)) {
            reject({error: { message: isDev ? xhr.status : ''}});
          }
          try{
            let resData = JSON.parse(res);
            if(resData.error && resData.error.token) {
              self.csrfToken = resData.error.token;
            }
            if(resData.error && resData.error.message && _.isObject(resData.error.message)) {
              reject({error: { message: isDev ? JSON.stringify(resData.error.message) : ''}});
            }else
              reject(resData);
          }catch(e){
            reject(xhr);
          }
        }
        if(!res) {
          resolve(res);
        }
        try {
          let resData = JSON.parse(res);
          if(resData.token){
            self.csrfToken = resData.token;
          }
          if(resData.data && resData.data.token) {
            self.csrfToken = resData.data.token;
          }
          resolve(resData);
        } catch (e) {
          resolve(res);
        }
      };
      xhr.open('post', action, true);
      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
      }
      const headers = option.headers || {};
      for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item]);
        }
      }
      xhr.send(formData);
    });
  },

  get: (url, params) => {
    if(!params) {
      return axios.get(url);
    }else{
      return axios.get(url, params && params.params ? params : {params});
    }
  },
  post: (url, params, options) => {
    let _options = options || {};
    if(!_options.hasOwnProperty('form')){
      _options.form = true;
    }
    return axios.post(url, params, _options);
  },
  delete: (url, params) => {
    return axios.delete(url, {data: params});
  },
  put: axios.put,
  restfulGet: (url, params) => {
    if(!params){
      return axios.get(url);
    }else{
      return axios.get(url, params && params.params ? params : {params});
    }
  },
  restfulPost: (url, params) => {
    return axios.post(url, params, {form: false});
  },
  restfulPut: (url, params) => {
    return axios.put(url, params, {form: false});
  },
  restfulDelete: (url, params) => {
    return axios.delete(url, {data: params}, {form: false});
  }
};

export default Http;
