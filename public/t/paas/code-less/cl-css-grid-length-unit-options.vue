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
      <a-select-option value="fr">轨道比例</a-select-option>
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