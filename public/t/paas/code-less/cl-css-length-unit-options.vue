<!-- Create By xBoson System -->

<template>
  <a-select @change='change' :value='value' :dropdownMatchSelectWidth='false'>
    <a-select-opt-group key='1'>
      <span slot="label">绝对长度</span>
      <a-select-option value="cm">厘米</a-select-option>
      <a-select-option value="mm">毫米</a-select-option>
      <a-select-option value="in">英寸</a-select-option>
      <a-select-option value="px">像素</a-select-option>
      <a-select-option value="pt">点</a-select-option>
      <a-select-option value="pc">派卡</a-select-option>
    </a-select-opt-group>
    
    <a-select-opt-group key='2'>
      <span slot="label">相对长度</span>
      <a-select-option value="em">元素的字体大小</a-select-option>
      <a-select-option value="ex">当前字体的 x-height</a-select-option>
      <a-select-option value="ch"> "0"（零）的宽度</a-select-option>
      <a-select-option value="rem">根元素的字体大小</a-select-option>
      <a-select-option value="vw">视口*宽度的 1%</a-select-option>
      
      <a-select-option value="vh">视口*高度的 1%</a-select-option>
      <a-select-option value="vmin">视口*较小尺寸的 1%</a-select-option>
      <a-select-option value="vmax">视口*较大尺寸的 1％</a-select-option>
      <a-select-option value="%">父元素占比</a-select-option>
    </a-select-opt-group>
  </a-select>
</template>

<script>
export default {
  props: ['change', 'value'],
}
</script>

<style scoped>
</style>