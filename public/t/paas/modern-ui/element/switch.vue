<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>Switch 开关</h2>
    <demo-layout :x='x'>
      <div v-pre>
<el-switch
  v-model="value"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
      </div>
    </demo-layout>
    
    <h3>文字描述</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-switch
  v-model="value1"
  active-text="按月付费"
  inactive-text="按年付费">
</el-switch>
<el-switch
  style="display: block"
  v-model="value2"
  active-color="#13ce66"
  inactive-color="#ff4949"
  active-text="按月付费"
  inactive-text="按年付费">
</el-switch>
      </div>
    </demo-layout>
    
    <h3>扩展的 value 类型</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-tooltip :content="'Switch value: ' + value" placement="top">
  <el-switch
    v-model="value"
    active-color="#13ce66"
    inactive-color="#ff4949"
    active-value="100"
    inactive-value="0">
  </el-switch>
</el-tooltip>
      </div>
    </demo-layout>
    
    <h3>禁用状态</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-switch
  v-model="value1"
  disabled>
</el-switch>
<el-switch
  v-model="value2"
  disabled>
</el-switch>
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
          value: true,
          value2: true,
          value1: true
        }
      }
    }
  }
}
</script>

<style>
</style>