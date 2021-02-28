<template>
  <div class="login-container clearfix">
    <div class="system-configure">
      <a-radio-group v-model="lang">
        <a-radio-button value="zh_cn">
          {{ $t('core.zh') }}
        </a-radio-button>
        <a-radio-button value="en_gb">
          {{ $t('core.en') }}
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="login-box">
      <a-form class="login-box--form" :label-col="{ span: 5 }" :wrapper-col="{ offset: 5 }">
        <a-form-item :label="$t('core.username')">
          <a-input v-model="username" placeholder="请输入用户名"></a-input>
        </a-form-item>
        <a-form-item :label="$t('core.password')">
          <a-input v-model="password" placeholder="请输入密码"></a-input>
        </a-form-item>
        <a-form-item :label="$t('core.authcode')">
          <a-input v-model="auth" placeholder="请输入验证码"></a-input>
        </a-form-item>
      </a-form>
      <div class="login-box--operate">
        <a-button ghost @click="login">{{ $t('core.login') }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      username: 'admin',
      password: 'admin',
      auth: '',
      lang: null
    };
  },
  watch: {
    lang: {
      handler (val) {
        this.$i18n.locale = val;
        this.$store.commit('login/setLang', val);
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('login', {
      setLogin: 'setLogin',
      setToken: 'setToken'
    }),
    login () {
      this.setLogin(true);
      this.setToken('success');
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
  .login-container {
    background: url('../../assets/bg.jpg');
    width: 100%;
    height: 100%;
    min-height: 600px;
    .login-box {
      width: 400px;
      padding: 10px 20px;
      box-shadow: 0 0 20px 2px grey;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .login-box--form {
        ::v-deep 
        .ant-form-item-label {
          label {
            color: white;
          }
        }
      }
      .login-box--operate {
        text-align: center;
      }
    }
  }
</style>