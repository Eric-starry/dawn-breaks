<template>
  <div class="layout-container">
    <side-bar></side-bar>
    <div class="layout-content">
      <head-bar></head-bar>
      <app-main></app-main>
      <foot-bar></foot-bar>
    </div>
  </div>
</template>

<script>
import headBar from './components/headbar/index.vue';
import sideBar from './components/sidebar/index.vue';
import footBar from './components/footbar/index.vue';
import appMain from '@/views/layout/components/appMain.vue'; 
export default {
  components: {
  headBar,
  sideBar,
  footBar,
  appMain
  },
  data () {
    return {

    };
  }
};
</script>

<style lang="scss" scoped>
  .layout-container {
    display: flex;
    .layout-side {
      flex: 0 0 256px;
    }
    .layout-content {
      flex: 1 1 auto;
    }
  }
</style>