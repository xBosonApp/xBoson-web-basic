<!-- Create By xBoson System -->

<template>
<doc>
  <h2>Table 表格</h2>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
:data="tableData"
style="width: 100%">
<el-table-column
  prop="date"
  label="日期"
  width="180">
</el-table-column>
<el-table-column
  prop="name"
  label="姓名"
  width="180">
</el-table-column>
<el-table-column
  prop="address"
  label="地址">
</el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>带斑马纹表格</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  :data="tableData"
  stripe
  style="width: 100%">
  <el-table-column
    prop="date"
    label="日期"
    width="180">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="180">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址">
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>带边框表格</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  :data="tableData"
  border
  style="width: 100%">
  <el-table-column
    prop="date"
    label="日期"
    width="180">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="180">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址">
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>带状态表格</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  :data="tableData"
  style="width: 100%"
  :row-class-name="tableRowClassName">
  <el-table-column
    prop="date"
    label="日期"
    width="180">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="180">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址">
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>固定表头</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  :data="tableData"
  height="250"
  border
  style="width: 100%">
  <el-table-column
    prop="date"
    label="日期"
    width="180">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="180">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址">
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>固定列</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  :data="tableData"
  border
  style="width: 100%">
  <el-table-column
    fixed
    prop="date"
    label="日期"
    width="150">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="120">
  </el-table-column>
  <el-table-column
    prop="province"
    label="省份"
    width="120">
  </el-table-column>
  <el-table-column
    prop="city"
    label="市区"
    width="120">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址"
    width="300">
  </el-table-column>
  <el-table-column
    prop="zip"
    label="邮编"
    width="120">
  </el-table-column>
  <el-table-column
    fixed="right"
    label="操作"
    width="100">
    <template slot-scope="scope">
      <el-button  type="text" size="small">查看</el-button>
      <el-button type="text" size="small">编辑</el-button>
    </template>
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>固定列和表头</h3>
  <demo-layout>
    <div v-pre>
<el-table
  :data="tableData"
  style="width: 100%"
  height="250">
  <el-table-column
    fixed
    prop="date"
    label="日期"
    width="150">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="120">
  </el-table-column>
  <el-table-column
    prop="province"
    label="省份"
    width="120">
  </el-table-column>
  <el-table-column
    prop="city"
    label="市区"
    width="120">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址"
    width="300">
  </el-table-column>
  <el-table-column
    prop="zip"
    label="邮编"
    width="120">
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>流体高度</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  :data="tableData"
  style="width: 100%"
  max-height="250">
  <el-table-column
    fixed
    prop="date"
    label="日期"
    width="150">
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="120">
  </el-table-column>
  <el-table-column
    prop="province"
    label="省份"
    width="120">
  </el-table-column>
  <el-table-column
    prop="city"
    label="市区"
    width="120">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址"
    width="300">
  </el-table-column>
  <el-table-column
    prop="zip"
    label="邮编"
    width="120">
  </el-table-column>
  <el-table-column
    fixed="right"
    label="操作"
    width="120">
    <div slot-scope="scope">
      <el-button
        type="text"
        size="small">
        移除
      </el-button>
    </div>
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  :data="tableData"
  style="width: 100%">
  <el-table-column
    prop="date"
    label="日期"
    width="150">
  </el-table-column>
  <el-table-column label="配送信息">
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column label="地址">
      <el-table-column
        prop="province"
        label="省份"
        width="120">
      </el-table-column>
      <el-table-column
        prop="city"
        label="市区"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="300">
      </el-table-column>
      <el-table-column
        prop="zip"
        label="邮编"
        width="120">
      </el-table-column>
    </el-table-column>
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>单选</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  ref="singleTable"
  :data="tableData"
  highlight-current-row
  style="width: 100%">
  <el-table-column
    type="index"
    width="50">
  </el-table-column>
  <el-table-column
    property="date"
    label="日期"
    width="120">
  </el-table-column>
  <el-table-column
    property="name"
    label="姓名"
    width="120">
  </el-table-column>
  <el-table-column
    property="address"
    label="地址">
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
  
  <h3>排序</h3>
  <demo-layout :x='x'>
    <div v-pre>
  <el-table
    :data="tableData"
    style="width: 100%"
    :default-sort = "{prop: 'date', order: 'descending'}"
    >
    <el-table-column
      prop="date"
      label="日期"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      :formatter="formatter">
    </el-table-column>
  </el-table>
    </div>
  </demo-layout>
  
  <h3>筛选</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-table
  ref="filterTable"
  :data="tableData"
  style="width: 100%">
  <el-table-column
    prop="date"
    label="日期"
    sortable
    width="180"
    column-key="date"
    :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
    :filter-method="filterHandler"
  >
  </el-table-column>
  <el-table-column
    prop="name"
    label="姓名"
    width="180">
  </el-table-column>
  <el-table-column
    prop="address"
    label="地址"
    :formatter="formatter">
  </el-table-column>
  <el-table-column
    prop="tag"
    label="标签"
    width="100"
    :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
    :filter-method="filterTag"
    filter-placement="bottom-end">
    <div slot-scope="scope">
      <el-tag
        :type="scope.row.tag === '家' ? 'primary' : 'success'"
        disable-transitions>{{scope.row.tag}}</el-tag>
    </div>
  </el-table-column>
</el-table>
    </div>
  </demo-layout>
</doc>
</template>

<script>
export default {
  data() {
    return {
      x : {
        data: {
          multipleSelection: [],
          
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },{
            date: '2016-05-09',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-05',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-11',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-22',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-18',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, ],
        },
        
        methods: {
          deleteRow(index, rows) {
            rows.splice(index, 1);
          },
          tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
              return 'warning-row';
            } else if (rowIndex === 3) {
              return 'success-row';
            }
            return '';
          },
          setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
          },
          handleCurrentChange(val) {
            this.currentRow = val;
          },
          formatter(row, column) {
            return row.address;
          },
          
          resetDateFilter() {
            this.$refs.filterTable.clearFilter('date');
          },
          clearFilter() {
            this.$refs.filterTable.clearFilter();
          },
          formatter(row, column) {
            return row.address;
          },
          filterTag(value, row) {
            return row.tag === value;
          },
          filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
          }
        },
      }
    }
  }
}
</script>

<style>
</style>