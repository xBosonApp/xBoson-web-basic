<!-- Create By xBoson System -->

<template>
  <dv-full-screen-container>
    <el-row style='flex:1' type='flex' gutter='20'>
      <el-col :span="6" style='flex:1'>
        <el-row style='flex:1; flex-flow: column; height: 100%' type='flex' gutter='20'>
          <dv-border-box-1>
            <div class='content'>
              <h4>紧急报警</h4>  
            </div>
          </dv-border-box-1>
          <dv-border-box-1>
            <div class='content'>
              <h4>故障统计</h4>
            </div>
          </dv-border-box-1>
          <dv-border-box-1>
            <div class='content'>
              <h4>报表统计</h4>
            </div>
          </dv-border-box-1>
        </el-row> 
      </el-col>
      
      <el-col :span="12">
        <el-row style='flex:1; flex-flow: column; height: 300px' type='flex' gutter='20'>
          <div class='content'></div>
        </el-row>
        <el-row style='flex:1; flex-flow: column; height: calc(100% - 300px)' type='flex' gutter='20'>
          <div class='content'></div>
        </el-row>
      </el-col>
      
      <el-col :span="6">
        <el-row style='flex:1; flex-flow: column; height: 100%' type='flex' gutter='20'>
          <dv-border-box-1><div class='content'></div></dv-border-box-1>
          <dv-border-box-1><div class='content'></div></dv-border-box-1>
          <dv-border-box-1><div class='content'></div></dv-border-box-1>
          <dv-border-box-1><div class='content'></div></dv-border-box-1>
          <dv-border-box-1><div class='content'></div></dv-border-box-1>
        </el-row>
      </el-col>
    </el-row>
  </dv-full-screen-container>
</template>

<script>
export default {
}
</script>

<style scoped>
h4 {
  border-left: 15px solid red; padding-left: 10px!important;
}
</style>