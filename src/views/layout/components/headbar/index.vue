<template>
  <div class="layout-head" v-if="headMenu">
    <a-menu v-model="current" mode="horizontal" @click="handleClick">
      <a-menu-item v-for="item in headMenu" :key="item.path">{{item.name}}</a-menu-item>
      <!-- <a-menu-item key="app" disabled> <a-icon type="appstore" />Navigation Two </a-menu-item>
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper"
          ><a-icon type="setting" />Navigation Three - Submenu</span
        >
        <a-menu-item-group title="Item 1">
          <a-menu-item key="setting:1">
            Option 1
          </a-menu-item>
          <a-menu-item key="setting:2">
            Option 2
          </a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="Item 2">
          <a-menu-item key="setting:3">
            Option 3
          </a-menu-item>
          <a-menu-item key="setting:4">
            Option 4
          </a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-menu-item key="alipay">
        <a href="https://antdv.com" target="_blank" rel="noopener noreferrer"
          >Navigation Four - Link</a
        >
      </a-menu-item> -->
    </a-menu>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data () {
    return {
      current: []
    };
  },
  computed: {
    ...mapGetters('menu', {
      'headMenu': 'headMenu'
    })
    // current: {
    //   get (val) {
    //     return val;
    //   },
    //   set (val) {
    //     this.setHeadPath(val);
    //   }
    // }
  },
  watch: {
    current (val) {
      console.log(val);
    }
  },
  mounted () {
    this.current = this.headMenu && [this.headMenu[0].path];
  },
  methods: {
    handleClick (item, key, keyPath) {
      console.log(item, key, keyPath);
      this.$router.push(item.key);
    }
  }
};
</script>