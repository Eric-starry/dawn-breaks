<template>
  <div class="dawn-ui">
    <p>UI大杂烩</p>
    <div class="dawn-content-side">
      <a-tag v-for="comp in comps" :key="comp.id" @click="click(comp.id)">{{comp.name}}</a-tag>
    </div>
    <component :is="current"></component>
  </div>
</template>

<script>
import pageButton from './button/index.vue';
export default {
  components: {
    'page-button': pageButton
  },
  data () {
    return {
      comps: [
        {
          name: 'Button',
          id: 'page-button'
        }
      ],
      current: 'page-button'
    };
  },
  methods: {
    click (page) {
      this.current = page;
    }
  }
};
</script>

<style lang="scss" scoped>
  .dawn-ui {
    padding: 10px;
  }
</style>