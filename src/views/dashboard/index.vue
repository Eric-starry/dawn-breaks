<template>
  <div class="dashboard-container">
    111
    <a-pagination :default-current="1" :total="50" show-size-changer />
    <a-date-picker />
    <a-time-picker />
    <a-range-picker style=" width: 200px " />
    <div class="test">
      <div class="one">1</div>
      <div class="two">2</div>
      <div class="three">3</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    };
  },
  mounted () {
    this.sor();
  },
  methods: {
    sor () {
      let arr = [2,1,3,6,5,7];
      for (let i = 0; i<arr.length-1; i++) {
        for (let j=0;j<arr.length-1-i;j++){
          if (arr[j] > arr[j+1]){
            let temp = '';
            temp = arr[j+1];
            arr[j+1] = arr[j];
            arr[j] = temp;
          }
        }
      }
      console.log(arr);
    }
  }
};
</script>

<style lang="scss" scoped>
  .test {
    div {
      border: 1px solid grey;
    }
  }
</style>