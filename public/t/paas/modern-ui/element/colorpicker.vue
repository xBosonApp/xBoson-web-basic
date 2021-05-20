<!-- Create By xBoson System -->

<template>
  <doc>
    <h2>ColorPicker 颜色选择器</h2>
    <demo-layout :x='x'>
      <div v-pre>
<div class="block">
  <span class="demonstration">有默认值</span>
  <el-color-picker v-model="color1"></el-color-picker>
</div>
<div class="block">
  <span class="demonstration">无默认值</span>
  <el-color-picker v-model="color2"></el-color-picker>
</div>
      </div>
    </demo-layout>
    
    <h3>选择透明度</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-color-picker v-model="color" show-alpha></el-color-picker>
      </div>
    </demo-layout>
    
    <h3>预定义颜色</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-color-picker
  v-model="color"
  show-alpha
  :predefine="predefineColors">
</el-color-picker>
      </div>
    </demo-layout>
    
    <h3>不同尺寸</h3>
    <demo-layout :x='x'>
      <div v-pre>
<el-color-picker v-model="color"></el-color-picker>
<el-color-picker v-model="color" size="medium"></el-color-picker>
<el-color-picker v-model="color" size="small"></el-color-picker>
<el-color-picker v-model="color" size="mini"></el-color-picker>
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
          color1: '#409EFF',
          color2: null,
          color: 'rgba(19, 206, 102, 0.8)',
          predefineColors: [
            '#ff4500',
            '#ff8c00',
            '#ffd700',
            '#90ee90',
            '#00ced1',
            '#1e90ff',
            '#c71585',
            'rgba(255, 69, 0, 0.68)',
            'rgb(255, 120, 0)',
            'hsv(51, 100, 98)',
            'hsva(120, 40, 94, 0.5)',
            'hsl(181, 100%, 37%)',
            'hsla(209, 100%, 56%, 0.73)',
            '#c7158577'
          ],
        }
      }
    }
  }
}
</script>

<style>
</style>