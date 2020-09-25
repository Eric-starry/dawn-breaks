<template>
  <div class="layout-side" v-if="sideMenu">
    <div class="layout-side--logo">
      <img src="../../../../assets/logo.png" alt="logo">
    </div>
    <a-menu
      style="width: 256px"
      mode="inline"
      theme="dark"
      v-model="current"
      :default-open-keys="defaultOpenKeys"
      @click="handleClick"
    >
    <template v-for="item in sideMenu">
      <a-sub-menu v-if="!item.hidden && item.children" :key="item.path" @titleClick="titleClick">
        <span slot="title"><a-icon type="appstore" /><span>{{ item.cname ? item.cname : item.name }}</span></span>
          <a-menu-item v-for="i in item.children" :key="i.path">
            {{ i.cname ? i.cname : i.name }}
          </a-menu-item>
      </a-sub-menu>
      <a-menu-item v-if="!item.hidden && !item.children" :key="item.path">
        {{ item.cname ? item.cname : item.name }}
      </a-menu-item>
    </template>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      defaultOpenKeys: [],
      defaultSelectedKeys: [],
      current: []
    };
  },
  computed: {
    ...mapGetters('menu', {
      sideMenu: 'sideMenu'
    })
  },
  watch: {
    sideMenu (val) {
      console.log(val);
    },
    $route (to) {
      this.current = [to.path];
    }
  },
  created () {
    let originOpen = this.$route.redirectedFrom ? this.$route.redirectedFrom : this.$route.path;
    this.defaultOpenKeys = [originOpen];
    this.current = [this.$route.path];
  },
  mounted () {
    
  },
  methods: {
    handleClick (item) {
      this.$router.push(item.key);
    },
    titleClick (item) {
      this.$router.push(item.key);
    }
  }
};
</script>

<style lang="scss" scoped>
  .layout-side {
    .layout-side--logo {
      text-align: center;
    }
  }
</style>