<!-- Create By xBoson System -->

<template>
  <draggable 
    :group="{ name: 'ui-component' }" 
    :list="nestedList"
    :style='style'
    :root-config='rootConfig'
    class='component-container draggable-item'
    animation='100' 
    chosenClass="clst-chosen" 
    ghostClass='clst-ghost' 
    @add='add' 
    @choose='chooseSelf'>
    
    <component 
      :is='getComponentName(e)' 
      :styleProp='e.props && e.props.style'
      :root-config='rootConfig'
      class='draggable-item'
      v-for="(e, idx) in nestedList" 
      v-bind='e.props'
      v-on='e.on'>{{e.txt}}</component>
    
  </draggable>
</template>

<script>
const clib = require("./component-library.js");
const crole = require("./component-role.js");

export default {
  props: ['nestedList', 'style', 'rootConfig'],
  
  data() {
    return {
    }  
  },
  
  methods : {
    add(ev) {
      let i = ev.newIndex;
      let tplcfg = this.nestedList[i];
      if (tplcfg == null || tplcfg.isInstance) return;
      
      let component = clib.getComponent(tplcfg.id);
      let instance = crole.createInstance(this.rootConfig, component);
      this.nestedList[i] = instance;
      
      if (component.plugins) {
        for (let n in component.plugins) {
          Vue.component(n, require(component.plugins[n], 1,1));
        }
      }
      
      this.$nextTick(function () {
        this.setAdjRef(i);
        this.$forceUpdate();
      });
    },
    
    chooseSelf(ev) {
      this.setAdjRef(ev.oldIndex);
    },
    
    setAdjRef(index) {
      let cfg = this.nestedList[index];
      this.$store.commit('setAdjustmentComponent', cfg);
      this.$store.commit('setNestedItemRef', { list: this.nestedList, index });
    },
    
    // 必须调用该方法, 否则直接用 component 属性会产生数组错位
    getComponentName(instance) {
      if (!instance.cid) return 'div'; // 第一次渲染, 元素没有改变
      return instance.helpTag || instance.component;
    }
  }
}
</script>

<style scoped>
.component-container {
  border: 1px dashed #ccc; padding: 5px;
  min-height: 30px;
}
.draggable-item:hover {
  border: 1px dashed #ccc;
}
</style>

<style>
.clst-chosen {
  border: 1px dashed #ccc; background-color: antiquewhite;
}
.clst-ghost {
  background-color: antiquewhite;
}
</style>