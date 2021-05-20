<!-- Create By xBoson System -->

<template><doc>
  <h2>Tag 标签</h2>
  <demo-layout>
    <div v-pre>
    <el-tag>标签一</el-tag>
    <el-tag type="success">标签二</el-tag>
    <el-tag type="info">标签三</el-tag>
    <el-tag type="warning">标签四</el-tag>
    <el-tag type="danger">标签五</el-tag>
    </div>
  </demo-layout>
  
  <h3>可删除标签</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-tag
  v-for="tag in tags"
  :key="tag.name"
  closable
  :type="tag.type">
  {{tag.name}}
</el-tag>
    </div>
  </demo-layout>
  
  <h3>不同尺寸</h3>
  <demo-layout :x='x'>
    <div v-pre>
<el-tag closable>默认标签</el-tag>
<el-tag size="medium" closable>中等标签</el-tag>
<el-tag size="small" closable>小型标签</el-tag>
<el-tag size="mini" closable>超小标签</el-tag>
    </div>
  </demo-layout>
  
  <h3>不同主题</h3>
  <demo-layout :x='x'>
    <div v-pre>
<div class="tag-group">
  <span class="tag-group__title">Dark</span>
  <el-tag
    v-for="item in items"
    :key="item.label"
    :type="item.type"
    effect="dark">
    {{ item.label }}
  </el-tag>
</div>
<div class="tag-group">
  <span class="tag-group__title">Plain</span>
  <el-tag
    v-for="item in items"
    :key="item.label"
    :type="item.type"
    effect="plain">
    {{ item.label }}
  </el-tag>
</div>
    </div>
  </demo-layout>
  
</doc></template>

<script>
export default {
data() {
  return {
    x: {
      data:{
        tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ],
        items: [
          { type: '', label: '标签一' },
          { type: 'success', label: '标签二' },
          { type: 'info', label: '标签三' },
          { type: 'danger', label: '标签四' },
          { type: 'warning', label: '标签五' }
        ],
      }
    }
  }
}
}
</script>

<style>
</style>