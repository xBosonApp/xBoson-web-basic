<!-- Create By xBoson System -->

<template>
  <div>
    <div v-for='(v, i) in value' class='row'>
      <a-input :value='i+1' disabled='true'/>
      <a-tooltip placement="top">
        <template slot="title">
          <div>auto : 自动调整</div>
          <div>1% : 按比例调整</div>
          <div>1px : 固定长度</div>
          <div>1fr : 轨道弹性系数</div>
          <div>minmax(min, max) : 函数用法</div>
        </template>
        <a-input v-model='value[i]'/> 
      </a-tooltip>
      <a-button type="danger" @click='remove(i)' 
        icon='close' shape="circle"></a-button>
    </div>
    <a-button type="dashed" @click='add' block 
      icon='plus' class='insert'></a-button>
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
      this.value = this.value.splice(i, 1);
    },
  },
}
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 35px 1fr auto; gap: 2px;
}
.insert {
  margin: 2px;
}
</style>