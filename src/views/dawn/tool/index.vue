<template>
  <div class="dawn-tool">
    <div class="dawn-tool--menu">
      <a-tag v-for="tool in toolList" :key="tool" @click="chooseTool(tool)">{{tool}}</a-tag>
    </div>
    <component :is="current"></component>
  </div>
</template>

<script>
import previewExcel from './previewExcel/index.vue';
import excelToJson from './excelToJson/index.vue';
export default {
  components: {
    'preview-excel': previewExcel,
    'excel-to-json': excelToJson
  },
  data () {
    return {
      current: 'preview-excel',
      toolList: ['preview-excel', 'excel-to-json']
    };
  },
  methods: {
    chooseTool (tool) {
      this.current = tool;
    }
  }
};
</script>

<style lang="scss" scoped>
  
</style>