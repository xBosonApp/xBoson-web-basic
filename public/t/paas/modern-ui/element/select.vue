<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>Select 选择器</h2>
    <demo-layout :x='x'>
      <div v-pre>
<el-select v-model="a" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.v"
      :label="item.t"
      :value="item.v">
    </el-option>
</el-select>
      </div>
    </demo-layout>
    
    <h3>有禁用选项</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-select v-model="a" placeholder="请选择">
  <el-option
    v-for="item in options"
    :key="item.v"
    :label="item.l"
    :value="item.v"
    :disabled="item.d">
  </el-option>
</el-select>
      </div>
    </demo-layout>

    <h3>禁用状态</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-select v-model="a" disabled placeholder="请选择">
  <el-option
    v-for="item in options"
    :key="item.v"
    :label="item.t"
    :value="item.v">
  </el-option>
</el-select>
      </div>
    </demo-layout>
    
    <h3>可清空单选</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <el-select v-model="a" clearable placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.v"
      :label="item.t"
      :value="item.v">
    </el-option>
  </el-select>
      </div>
    </demo-layout>
    
    <h3>基础多选</h3>
    <demo-layout :x='x'>
      <div v-pre>
  <el-select v-model="a" multiple placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.v"
      :label="item.t"
      :value="item.v">
    </el-option>
  </el-select>

  <el-select
    v-model="x"
    multiple
    collapse-tags
    style="margin-left: 20px;"
    placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.v"
      :label="item.t"
      :value="item.v">
    </el-option>
  </el-select>
      </div>
    </demo-layout>
    
    <h3>自定义模板 / 分组 / 可搜索 / 远程搜索</h3>
    <p>见官方文档</p>
    
    <h3>创建条目</h3>
    <p>可以创建并选中选项中不存在的条目</p>
    <demo-layout :x='x'>
      <div v-pre>
  <el-select
    v-model="a"
    multiple
    filterable
    allow-create
    default-first-option
    placeholder="请选择文章标签">
    <el-option
      v-for="item in options"
      :key="item.v"
      :label="item.t"
      :value="item.v">
    </el-option>
  </el-select>
      </div>
    </demo-layout>
    
  </doc>
</template>

<script>
export default {
  data() {
    return {
      x : {
        data : {
          options: [{v:1, t:'黑色'}, {v:2, t:'白色'}, {v:3, t:'红色', d:true}],
        }
      }
    }
  }
}
</script>

<style>
</style>