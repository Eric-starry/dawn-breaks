<template>
  <div class="draw-vue-directive" v-test1>
    <div class="test1">
      <div v-test v-for="i in testArr" :key="i" class="test">{{i}}</div>
    </div>
  </div>
</template>

<script>
var a = 0;
export default {
  directives: {
    test1: {
      inserted: function (el) {
        console.log(el);
        console.log(el.offsetWidth);
        console.log(el.offsetHeight);
      }
    },
    test: {
      inserted: function (el) {
        a += 300;
        el.style.width = '300px';
        el.style.height = '100px';
        el.style.border = '1px solid';
        console.log(a);
      }
    }
  },
  data () {
    return {
      testArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      elWidth: 0
    };
  },
  destroyed () {
    a = 0;
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
  .test {
    display: inline-block;
  }
</style>