<template>
  <div class="dawn-ui-button">
    <j-button type="primary" plain>primary</j-button>
    <j-button type="warning" plain>warning</j-button>
    <j-button type="danger" plain>danger</j-button>
    <j-button type="primary">主要按钮</j-button>
    <j-button type="warning">warning</j-button>
    <j-button type="danger">danger</j-button>
    <!-- <a-button type="primary" size="mini">111</a-button>
    <button class="button-3d-1">3D Button 1</button> -->
  </div>
</template>

<script>
import jButton from './components/j-button.vue';

export default {
  components: {
    'j-button': jButton
  },
  data () {
    return {

    };
  }
};
</script>

<style lang="scss">
  .dawn-ui-button {
    padding: 10px;
  }
</style>