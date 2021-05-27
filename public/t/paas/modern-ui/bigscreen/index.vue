<!-- Create By xBoson System -->

<template>
  <open-file-menu dir='bigscreen'>
    
    <el-menu-item-group title='政企大屏'>
      <el-menu-item index='page1'>施工养护综合数据</el-menu-item>
      <el-menu-item index='page3'>机电设备电子档案</el-menu-item>
      <el-menu-item index='page4'>机电运维管理台</el-menu-item>
    </el-menu-item-group>
    
    <el-menu-item-group title='轨道交通'>
      <el-menu-item index='page2'>综合首页</el-menu-item>
    </el-menu-item-group>
    
    <el-menu-item-group title='布局'>
      <el-menu-item index='l1'>布局1</el-menu-item>
      <el-menu-item index='l2'>布局2</el-menu-item>
      <el-menu-item index='l3'>布局3</el-menu-item>
    </el-menu-item-group>
    
  </open-file-menu>
</template>

<script>
export default {
}
</script>

<style lang='less'>
#dv-full-screen-container {
  padding: 5px; padding-left: 105px; background-color: #01213e; color: #e6e7f1;
  display: flex; flex-flow: column;
  
  .border {
    border: 0!important;
  }
  
  .el-row {
    padding-top: 20px;
  }
  
  .el-col .el-row:first-child {
    padding-top: 0;
  }
  
  h4, h1, h2, h3 {
    color: #eee; padding: 0;
  }
  
  .content {
    height: calc(100% - 40px); 
  }
  
  .border-box-content {
    padding: 20px;
  }
}
</style>