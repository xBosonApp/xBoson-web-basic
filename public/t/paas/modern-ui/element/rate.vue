<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>Rate 评分</h2>
    <demo-layout :x='x'>
      <div v-pre>
<div class="block">
  <span class="demonstration">默认不区分颜色</span>
  <el-rate v-model="value1"></el-rate>
</div>
<div class="block">
  <span class="demonstration">区分颜色</span>
  <el-rate
    v-model="value2"
    :colors="colors">
  </el-rate>
</div>
      </div>
    </demo-layout>
    
    <h3>辅助文字</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-rate
  v-model="value"
  show-text>
</el-rate>
      </div>
    </demo-layout>
    
    <h3>其它 icon</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-rate
  v-model="value"
  :icon-classes="iconClasses"
  void-icon-class="icon-rate-face-off"
  :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
</el-rate>
      </div>
    </demo-layout>
    
    <h3>只读</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-rate
  v-model="value"
  disabled
  show-score
  text-color="#ff9900"
  score-template="{value}">
</el-rate>
      </div>
    </demo-layout>
  </doc>
</template>

<script>
export default {
  data() {
    return {
      x: {
        data: {
          value1: null,
          value2: null,
          colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
          value: 3.7,
          iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
        },
      }
    }
  }
}
</script>

<style>
</style>