<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';
const languageMap = {
  'zh_cn': zhCN,
  'en_gb': null
};
export default {
  data () {
    return {
      locale: null
    };
  },
  computed: {
    lang () {
      return this.$store.state.login.lang;
    }
  },
  watch: {
    lang (val) {
      console.log('system----lang', val);
      this.locale = languageMap[val];
    }
  },
  mounted () {
    console.log('origin----lang', this.locale);
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  color: #2c3e50;
}
.clearfix::before {
  content: ''; 
  display: block;
}
</style>
