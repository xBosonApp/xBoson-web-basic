<!-- Create By xBoson System -->

<template>
  <div>
    <div v-for='(v, i) in value' class='row'>
      <a-input :value='i+1' disabled='true'/>
      <cl-css-number v-model='value[i]' optionComponent='cl-css-grid-length-unit-options'/> 
      <a-button type="danger" @click='remove(i)' 
        icon='close' shape=""/>
    </div>
    
    <div class='row'>
      <a-tooltip placement="left">
        <template slot="title">
          <div>auto : 自动调整</div>
          <div>1% : 按比例调整</div>
          <div>1px : 固定长度</div>
          <div>1fr : 轨道弹性系数</div>
          <div>minmax(min, max) : 函数用法</div>
        </template>
        <a-button type="dashed" size='small'>?</a-button>
      </a-tooltip>
      <cl-add-button @click='add' title='Insert'/>
      <a-button type="dashed" @click='removeLast' icon='minus' size='small'/>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  
  methods : {
    add() {
      if (!this.value) {
        this.value = [];
        this.$emit('input', this.value);
      }
      this.value.push('auto');
    },
    
    remove(i) {
      this.value.splice(i, 1);
    },
    
    removeLast() {
      this.value.pop();
    },
  },
}
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 35px 1fr 32px; gap: 2px; margin: 2px;
}
.row>button {
  width: 100% !important;
}
</style>