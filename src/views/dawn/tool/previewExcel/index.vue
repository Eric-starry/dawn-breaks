<template>
  <div class="dawn-tool-previewexcel">
    <div>
      <a-upload
        class="upload"
        action=""
        :multiple="false"
        :showUploadList="false"
        accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :custom-request="httpRequest">
        <a-button size="small" type="primary">上传</a-button>
      </a-upload>
    </div>
      <a-table
        :columns="columns" 
        :data-source="tableData"
        rowKey="key"
        border
        style="width: 100%">
      </a-table>
  </div>
</template>

<script>
import XLSX from 'xlsx';
export default {
  data () {
    return {
      tableData: [],
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex'
        },
      ]
    };
  },
  methods: {
    httpRequest (e) {
      let file = e.file;
      if (!file) {
        // 没有文件
        return false;
      } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        // 格式根据自己需求定义
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary' // 以字符编码的方式解析
          });
          const exlname = workbook.SheetNames[0]; // 取第一张表
          const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
          // 将 JSON 数据挂到 data 里
          this.tableData = exl;
          console.log(this.tableData);
          // document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
        } catch (e) {
          console.log('出错了：：');
          return false;
        }
      };
      fileReader.readAsBinaryString(file);
    }
  }
};
</script>
