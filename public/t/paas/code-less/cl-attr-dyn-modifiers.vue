<!-- Create By xBoson System -->

<template>
  <draggable 
    :group="{ name: 'event-modifiers' }" 
    :list="eventMap"
    animation='100' 
    @update='updateModifiers'
  >
    <div v-for='(v, i) in eventMap' class='items-group' :key='i'>
      <a-checkbox class='i pd' v-model="v.u" @change='updateModifiers'/>
      <span class='note i'>{{v.k}}</span>
      <span class='i'>{{v.n}}</span>
    </div>
  </draggable>
</template>

<script>
export default {
  props : ['modifiers'],
  
  mounted() {
    const max = this.eventMap.length;
    this.eventMap.sort((a, b)=>{
      let x = this.modifiers.indexOf(a.k);
      if (x >= 0) a.u = true;
      else x = max;
      
      let y = this.modifiers.indexOf(b.k);
      if (y >= 0) b.u = true;
      else y = max;
      
      return x - y;
    });
  },
  
  data() {
    return {
      eventMap : [
        { k:'.stop',    n:'停止冒泡',             u:false },
        { k:'.prevent', n:'阻止默认行为',         u:false },
        { k:'.once',    n:'只触发一次',           u:false },
        { k:'.native',  n:'只监听DOM原生事件',    u:false },
        { k:'.self',    n:'只被元素自身事件触发', u:false },
        { k:'.capture', n:'监听捕获事件',         u:false },
        { k:'.passive', n:'passive 模式监听器',   u:false },
      ],
    };
  },
  
  methods : {
    updateModifiers() {
      this.eventMap.forEach((v, i)=>{
        if (v.u) {
          this.modifiers[i] = v.k;
        } else {
          this.modifiers[i] = null;
        }
      });
    },
  },
}
</script>

<style scoped>
.items-group .i {
  border-color: #eee; cursor: move; margin-top: 2px;
}
.items-group {
  grid-template-columns: 30px 1fr 3fr;  gap: 0;
}
.pd {
  padding-left: 10px;
}
</style>