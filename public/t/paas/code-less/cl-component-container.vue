<!-- Create By xBoson System -->

<template>
  <draggable 
    :group="{ name: 'ui-component' }" 
    :list="nestedList"
    :style='style'
    :root-config='rootConfig'
    :class="{'component-container':!isRoot, 'root-component-container': isRoot}"
    animation='100' 
    chosenClass="clst-chosen" 
    ghostClass='clst-ghost' 
    @add='add' 
    @choose='chooseSelf'
    @update='onUpdate'>
    
    <component 
      :is='getComponentName(e)' 
      :styleProp='e.props && e.props.style'
      :root-config='rootConfig'
      :class="getClass(e)"
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
      hover:{},
    }  
  },
  
  methods : {
    getClass(e) {
      let ret = { 'draggable-item-active': this.isHover(e.id) };
      for (let id in e.bindStyle) {
        ret[id] = true;
      }
      return ret;
    },
    
    isHover(id) {
      if (this.hover[id] === undefined) {
        this.$set(this.hover, id, false);
      }
      return this.hover[id];
    },
    
    setHover(id, b) {
      if (this.hover[id] === undefined) {
        this.$set(this.hover, id, b);
      } else {
        this.hover[id] = b;
      }
    },
    
    add(ev) {
      let i = ev.newIndex;
      let tplcfg = this.nestedList[i];
      
      if (tplcfg == null) {
        console.error("why is null?");
        return;
      }
      
      if (tplcfg.isInstance) {
        // Draggable 有时发送错位的索引: 把对象插入数组位置1上, 返回的索引为2
        let needInstantiated;
        for (let x=0; x<this.nestedList.length; ++x) {
          if (!this.nestedList[x].isInstance) {
            needInstantiated = this.nestedList.splice(x, 1);
            break;
          }
        }
        
        if (needInstantiated) {
          tplcfg = needInstantiated[0];
        } else {
          // 如果把一个实例从一个容器移动到另一个容器上, 发生这种情况
          // console.warn('Draggable bad index', i, 'cannot fix', tplcfg);
          // this.nestedList.forEach((c, i)=>{
          //   console.log(i, c.id);
          // });
          return;
        }
      }
      
      let component = clib.getComponent(tplcfg.id);
      if (component.plugins) {
        tool.loadPlugins(component.plugins);
      }
      
      let instance = crole.createInstance(this.rootConfig, component);
      this.$set(this.nestedList, i, instance);
      this.$store.commit('setEditFileChanged', true);
      this.setAdjRef(i);
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
  border: 1px dashed #ccc; padding: 8px; margin: 10px 2px;
  min-height: 30px;
}
.root-component-container {
  border: 1px dashed green; padding: 8px;
  min-height: 30px;
}
.draggable-item-active {
  border: 1px dashed #3e33e9;
}
.clst-chosen {
  border: 1px solid #13bc13 !important; background-color: antiquewhite;
}
.clst-ghost {
  color: #fff; background-color: #000;
}
</style>