<!-- Create By xBoson System -->

<template>
  <div>
  <div class='dd-footer' v-if='showtip()'>拖拽组件到这里</div>
  
  <draggable :group="{ name: 'ui-component' }" v-model="list" @add='add' class='draggable'
        animation='100' chosenClass="clst-chosen" ghostClass='clst-ghost' @choose='chooseSelf'>
    
    <component v-for="(e, idx) in list" :is='getComponentName(e.cid)' 
      v-bind='e.props' v-on='e.on'>{{e.txt}}</component>
    
  </draggable>
  </div>
</template>

<script>
const clib = require("./component-library.js");
const crole = require("./component-role.js");

export default {
  props: ['list'],
  
  data() {
    return {
    }  
  },
  
  methods : {
    showtip() {
      return this.list.length == 0 && this.$store.state.showDropTip;
    },
    
    add(ev) {
      let i = ev.newIndex;
      let tplcfg = this.list[i];
      
      let component = clib.getComponent(tplcfg.id);
      let instance = crole.createInstance(component);
      this.list[i] = instance;
      
      this.$nextTick(function () {
        this.$store.commit('setAdjustmentComponent', this.list[i]);
        this.$forceUpdate();
      });
    },
    
    chooseSelf(ev) {
      let cfg = this.list[ev.oldIndex];
      this.$store.commit('setAdjustmentComponent', cfg);
    },
    
    // 必须调用该方法, 否则直接用 component 属性会产生数组错位
    getComponentName(id) {
      if (!id) return 'div'; // 第一次渲染, 元素没有改变
      return clib.getComponent(id).component;
    }
  }
}
</script>

<style scoped>
.dd-footer {
  text-align: center; color: #999; padding: 150px 0; background-color: #eee; position: absolute;
  width: 99%; font-size: 1.5em;
}
.draggable {
  min-height: 300px;
}
</style>

<style>
.clst-chosen {
  border: 1px dashed #ccc;
}
.clst-ghost {
  background-color: antiquewhite;
}
</style>