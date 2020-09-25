<template>
  <div class="login-container clearfix">
    <div class="login-box">
      <a-form class="login-box--form" :label-col="{ span: 5 }" :wrapper-col="{ offset: 5 }">
        <a-form-item label="用户名" placeholder="请输入用户名">
          <a-input v-model="username"></a-input>
        </a-form-item>
        <a-form-item label="密码" placeholder="请输入密码">
          <a-input v-model="password"></a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model="auth"></a-input>
        </a-form-item>
      </a-form>
      <div class="login-box--operate">
        <a-button ghost @click="login">登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      username: 'admin ',
      password: 'admin',
      auth: ''
    };
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
    .login-box {
      width: 400px;
      padding: 10px 20px;
      margin: 0 auto;
      margin-top: 200px;
      box-shadow: 0 0 20px 2px grey;
      .login-box--form {
        ::v-deep 
        .ant-form-item-label {
          label {
            color: white;
          }
        }
      }
    }
  }
</style>