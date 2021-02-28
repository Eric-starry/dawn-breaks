<template>
  <div class="dawn-tool-exceltojson">
    <div>
      <label for="">Excel Path</label><input type="text" v-model="excel">
    </div>
    <div>
      <label for="">Json Path</label><input type="text" v-model="json">
    </div>
    <a-button @click="excelToJson(excel, json)">提交</a-button>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import fs from 'fs';

export default {
  data () {
    return {
      excel: './test.xlsx',
      json: './test.json'
    };
  },
  methods: {
    async excelToJson (src, dst, n = 0) {
      // const workbook = new XLSX.Workbook(); // 创建文档对象
      let workbook = await XLSX.readFile(src); // 使用文档对象读取excel文件
      const worksheet = workbook.sheetNames[n]; // 获取第n张表
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[worksheet]);
      console.log(jsonData);
      // await fs.writeFileSync(dst, jsonData);
    }
  }
};
</script>