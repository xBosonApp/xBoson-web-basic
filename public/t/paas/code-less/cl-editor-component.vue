<!-- Create By xBoson System -->

<template>
  <div>
  <div class='dd-footer' v-if='showtip()'>拖拽组件到这里</div>
  
  <draggable :group="{ name: 'ui-component' }" v-model="list" @add='add' class='draggable'
        animation='100' chosenClass="clst-chosen" ghostClass='clst-ghost' @choose='chooseSelf'>
    
    <component v-for="(e, idx) in list" :is='getComponentName(e.id)' 
      v-bind='e.props' v-on='e.on'>{{e.txt}}</component>
    
  </draggable>
  </div>
</template>

<script>
const clib = require("./component-library.js");

export default {
  data() {
    return {
      list : [],
    }  
  },
  
  methods : {
    showtip() {
      return this.list.length == 0 && this.$store.state.showDropTip;
    },
    
    add(ev) {
      let i = ev.newIndex;
      let tplcfg = this.list[i];
      let cfg = this.list[i] = {};
      for (let n in tplcfg) {
        cfg[n] = tplcfg[n];
      }
      cfg.props = {};
      cfg.on = {};
      clib.initProps(cfg.id, cfg.props);
      
      this.$nextTick(function () {
        this.$store.commit('setAdjustmentComponent', this.list[i]);
        this.$forceUpdate();
      });
    },
    
    chooseSelf(ev) {
      let cfg = this.list[ev.oldIndex];
      this.$store.commit('setAdjustmentComponent', cfg);
    },
    
    getComponentName(id) {
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