<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>Link 文字链接</h2>
    
    <h3>基础用法</h3>
    <demo-layout>
      <div v-pre>
<div>
  <el-link href="https://element.eleme.io" target="_blank">默认链接</el-link>
  <el-link type="primary">主要链接</el-link>
  <el-link type="success">成功链接</el-link>
  <el-link type="warning">警告链接</el-link>
  <el-link type="danger">危险链接</el-link>
  <el-link type="info">信息链接</el-link>
</div>
      </div>
    </demo-layout>
    
    <h3>禁用状态</h3>
    <demo-layout>
      <div v-pre>
<div>
  <el-link disabled>默认链接</el-link>
  <el-link type="primary" disabled>主要链接</el-link>
  <el-link type="success" disabled>成功链接</el-link>
  <el-link type="warning" disabled>警告链接</el-link>
  <el-link type="danger" disabled>危险链接</el-link>
  <el-link type="info" disabled>信息链接</el-link>
</div>
      </div>
    </demo-layout>
    
    <h3>下划线</h3>
    <demo-layout>
      <div v-pre>
<el-link :underline="false">无下划线</el-link>
<el-link>有下划线</el-link>
      </div>
    </demo-layout>
    
    <h3>图标</h3>
    <demo-layout>
      <div v-pre>
<el-link icon="el-icon-edit">编辑</el-link>
<el-link>查看<i class="el-icon-view el-icon--right"></i> </el-link>
      </div>
    </demo-layout>
  </doc>
</template>

<script>
export default {
}
</script>

<style>
</style>