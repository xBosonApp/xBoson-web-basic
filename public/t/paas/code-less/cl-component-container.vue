<!-- Create By xBoson System -->

<template>
  <draggable 
    :group="{ name: 'ui-component' }" 
    :list="nestedList"
    :style='style'
    :root-config='rootConfig'
    :class="{'component-container':!isRoot, 'root-component-container': isRoot}"
    animation='100' 
    chosenClass="cl-drag-drop-component-chosen" 
    ghostClass='cl-drag-drop-component-ghost' 
    @add='add' 
    @choose='chooseSelf'
    @update='onUpdate'>
    
    <component 
      :is='getComponentName(e)' 
      :styleProp='e.props && e.props.style'
      :root-config='rootConfig'
      :class="bindClass[e.id]"
      :key='idx'
      @mouseover.native.self="setHover(e.id, true)"
      @mouseout.native.self="setHover(e.id, false)"
      @mouseover.self="setHover(e.id, true)"
      @mouseout.self="setHover(e.id, false)"
      v-for="(e, idx) in nestedList" 
      v-bind='e.props'
      v-on='e.on'>{{e.txt}}</component>
    
  </draggable>
</template>

<script>
const clib = require("./component-library.js");
const crole = require("./component-role.js");
const tool = require("./tool.js");

export default {
  props: ['nestedList', 'style', 'rootConfig', 'isRoot'],
  
  data() {
    return {
      bindclass:{},
    }
  },
  
  computed: {
    bindClass() {
      for (let i=0; i<this.nestedList.length; ++i) {
        let item = this.nestedList[i];
        let cl = this.bindclass[item.id];
        if (!cl) {
          cl = { 'draggable-item-active': false };
          this.$set(this.bindclass, item.id, cl);
        }
        for (let n in item.bindStyle) {
          cl[n] = item.bindStyle[n];
        }
      }
      return this.bindclass;
    },
  },
  
  methods : {
    setHover(id, b) {
      if (this.bindclass[id] === undefined) {
        this.$set(this.bindclass, id, {'draggable-item-active':b});
      } else {
        this.bindclass[id]['draggable-item-active'] = b;
      }
    },
    
    add(ev) {
      const i = ev.newIndex;
      let tplcfg = this.nestedList[i];
      
      if (tplcfg == null) {
        console.error("why is null?");
        return;
      }
      
      if (tplcfg.isInstance) {
        // Draggable 有时发送错位的索引: 把对象插入数组位置1上, 返回的索引为2
        // throw new Error("bad index");
      
        for (let x=0; x<this.nestedList.length; ++x) {
          let item = this.nestedList[x];
          if (!item.isInstance) {
            let instance = this.initComonent(item.id, x);
            if (x != i) {
              this.nestedList.splice(x, 1);
              this.nestedList.splice(i, 0, instance);
            }
          }
        }
      } else {
        this.initComonent(tplcfg.id, i);
      }
    },
    
    initComonent(id, index) {
      let component = clib.getComponent(id);
      if (component.plugins) {
        //TODO: 将插件加载到局部组件库
        tool.loadPlugins(component.plugins);
      }
      
      let instance = crole.createInstance(this.rootConfig, component);
      this.$set(this.nestedList, index, instance);
      this.$store.commit('setEditFileChanged', true);
      this.setAdjRef(index);
      return instance;
    },
    
    chooseSelf(ev) {
      this.setAdjRef(ev.oldIndex);
    },
    
    onUpdate() {
      this.$store.commit('setEditFileChanged', true);
    },
    
    setAdjRef(index) {
      let cfg = this.nestedList[index];
      this.$store.commit('setAdjustmentComponent', cfg);
      this.$store.commit('setNestedItemRef', { list: this.nestedList, index });
    },
    
    // 必须调用该方法, 否则直接用 component 属性会产生数组错位
    getComponentName(instance) {
      if (!instance.isInstance) return 'div'; // 第一次渲染, 元素没有改变
      return instance.helpTag || instance.component;
    }
  }
}
</script>

<style scoped>
.component-container {
  border: 1px dashed #ccc; padding: 8px; margin: 10px 2px; min-height: 30px;
}
.root-component-container {
  /*border: 1px dashed green;*/ padding: 8px; min-height: 30px;
}
.draggable-item-active {
  border: 1px dashed #3e33e9 !important;
}
</style>