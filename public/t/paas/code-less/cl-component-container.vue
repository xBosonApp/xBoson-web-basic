<!-- Create By xBoson System -->

<template>
  <draggable 
    :group="{ name: 'ui-component' }" 
    :list="nestedList"
    :style='styleProp'
    :rootConfig='rootConfig'
    :class="{ 'component-container':!isRoot, 'root-component-container': isRoot, 'draggable-item':true }"
    :swapThreshold='0.2'
    :tag='tag'
    :componentData='componentData'
    :key='pkey'
    
    v-components-loader='$options.components'
    animation='100' 
    chosenClass="cl-drag-drop-component-chosen" 
    ghostClass='cl-drag-drop-component-ghost' 
    draggable='.draggable-item'
    
    @add='add' 
    @choose='onChoose'
    @update='onUpdate'
  >
    <component 
      v-bind='e.props'
      v-on='e.on'
      v-for="(e, idx) in nestedList" 
      v-if='e.isInstance'
      
      :is='getComponentName(e)' 
      :styleProp='e.props && e.props.style'
      :rootConfig='rootConfig'
      :class="bindClass[e.id]"
      :key='e.id'
      :clComponentInstance='e'
      
      @mouseover.native.self="setHover(e.id, true, e.isContainer)"
      @mouseout.native.self="setHover(e.id, false, e.isContainer)"
      @mouseover.self="setHover(e.id, true, e.isContainer)"
      @mouseout.self="setHover(e.id, false, e.isContainer)"
    >
      <span v-if='!(e.isContainer || e.removeTxt)' v-frag>
        {{ e.txt }}
      </span>
    </component>
    
  </draggable>
</template>

<script>
const clib  = require("./component-library.js");
const crole = require("./component-role.js");
const tool  = require("./tool.js");
const methodPitch = ['setChildProps'];
let key = 1;

export default {
  props: ['nestedList', 'styleProp', 'rootConfig', 'isRoot', 'clComponentInstance'],
  
  data() {
    return {
      tag  : 'div',
      pkey : key++,
      bindclass     : {},
      componentData : {},
    }
  },
  
  created() {
    clib.init().then(()=>{
      this.loadDepsComponentLib();
      this.initContainerInstanceTag();  
    });
  },
  
  computed: {
    bindClass() {
      for (let i=0; i<this.nestedList.length; ++i) {
        let item = this.nestedList[i];
        let cl = this.bindclass[item.id];
        if (!cl) {
          cl = this.newDragClass(false, item.isContainer);
          this.$set(this.bindclass, item.id, cl);
        }
        for (let n in item.bindStyle) {
          cl[n] = item.bindStyle[n];
        }
      }
      return this.bindclass;
    },
  },
  
  errorCaptured(err, vm, info) {
    console.warn(info, err, vm);
    return false;
  },
  
  methods : {
    initContainerInstanceTag() {
      let clci = this.clComponentInstance;
      if (!clci) return;
      
      // BUG: 部分父子组件关系需要严格匹配, 
      // 中间插入其他tag导致异常(依赖$parent属性)
      // 异常抛出后, 拖拽组件停止工作
      // this.tag = this.getComponentRealName(clci); 
      
      this.pkey = clci.id;
      this.load_plugin(clci.clid, clci.cid)();
      
      this.makeVirtualProp(clci.props, 'styleProp', clci.props.style);
      this.makeVirtualProp(clci.props, 'rootConfig', this.rootConfig);
      
      this.componentData.on = clci.on;
      this.componentData.props = clci.props;
    },
    
    makeVirtualProp(obj, name, val) {
      if (!obj[name]) {
        Object.defineProperty(obj, name, {
          get() { return val; }
        });
      }
    },
    
    setHover(id, b, isContainer) {
      if (this.bindclass[id] === undefined) {
        this.$set(this.bindclass, id, this.newDragClass(b, isContainer));
      } else {
        this.bindclass[id]['draggable-item-active'] = b;
      }
    },
    
    newDragClass(active, isContainer) {
      return { 
        'draggable-item': !isContainer, 
        'draggable-item-active': active,
      };
    },
    
    add(ev) {
      const i = ev.newIndex;
      let tplcfg = this.nestedList[i];
      
      if (tplcfg == null) {
        console.error("why is null?", i, ev);
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
        this.load_plugin(component.clid, id)();
      }
      this.save_requires(component.clid);
      
      let instance = crole.createInstance(this.rootConfig, component);
      this.$set(this.nestedList, index, instance);
      this.$store.commit('setEditFileChanged', true);
      this.setAdjRef(index);
      return instance;
    },
    
    onChoose(ev) {
      this.setAdjRef(ev.oldIndex);
      // let [x, y] = this.getOffset(ev.srcElement);
      // console.log(x, y, ev)
    },
    
    getOffset(el) {
      let x = el.offsetLeft, y = el.offsetTop;
      let p = el.offsetParent;
      while (p) {
        x += p.offsetLeft;
        y += p.offsetTop;
        if (p == el.offsetParent) break;
        p = el.offsetParent;
      }
      return [x, y];
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
      if (!instance.isInstance) {
        return 'div'; // 第一次渲染, 元素没有改变
      }
      if (instance.isContainer) {
        return 'cl-component-container';
      }
      return this.getComponentRealName(instance);
    },
    
    getComponentRealName(i) {
      return i.helpTag || i.component;
    },
    
    loadDepsComponentLib() {
      for (let i=0; i<this.nestedList.length; ++i) {
        let item = this.nestedList[i];
        let loader = this.load_plugin(item.clid, item.cid);
        
        if (item.clid) {
          this.$store.commit('loadComponentsFromLibrary', [item.clid, loader]);
        } else {
          console.warn("Component not has libraryID attribute");
          loader();
        }
      }
    },
    
    // 加载设计时插件, 返回一个加载器函数.
    load_plugin(clid, cid) {
      return ()=>{
        let _next = ()=>{
          clib.makeComponentPluginLoader(cid, this.$options.components);
          this.$forceUpdate();
        };
        this.$store.commit('loadComponentsFromLibrary', [clid, _next]);
      };
    },
    
    save_requires(clid) {
      clib.saveLibRequires(clid, this.rootConfig.requires);
    },
  }
}
</script>

<style scoped>
.component-container {
  border: 1px dashed #ccc; padding: 20px 8px; margin: 10px 2px; min-height: 30px;
}
.root-component-container {
  /*border: 1px dashed green;*/ padding: 8px; min-height: 200px;
}
.draggable-item {
  border: 1px dashed #f1f1f1; min-height: 5px;
}
.draggable-item-active {
  border: 1px dashed #3e33e9 !important;
}
</style>