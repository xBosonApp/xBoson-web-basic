<!-- Create By xBoson System -->

<template>
  <Container
    :class="{ 'component-container':!isRoot, 'root-component-container': isRoot }"
    :tag='tag'
    group-name='ui-component'
    v-components-loader='$options.components'
  >
    <Draggable
      v-for="(e, idx) in nestedList" 
      v-if='e.isInstance'
      :tag='getTag(e)'
      :class="bindClass[e.id]"
      :key='e.id'
      v-components-loader='$options.components'
    >
      <span v-if='!(e.isContainer || e.removeTxt)' v-frag>
        {{ e.txt }}
      </span>
    </Draggable>
  </Container>
</template>

<script>
const clib  = require("./component-library.js");
const crole = require("./component-role.js");
const tool  = require("./tool.js");
const dnd   = require("cdn/xboson-vue/1.0.0/loader/smooth-dnd.js");

export default {
  props: ['nestedList', 'styleProp', 'rootConfig', 'isRoot', 'clComponentInstance'],
  
  components: {
    Container : dnd.Container, 
    Draggable : dnd.Draggable,
  },
  
  data() {
    return {
      tag : { value: 'div' },
      bindclass:{},
      componentData:{},
    };
  },
  
  mounted() {
    console.log('!1!!', this.nestedList, this.styleProp, this.isRoot)
    this.loadDepsComponentLib();
    this.initContainerInstanceTag();
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
  
  methods: {
    initContainerInstanceTag() {
      let clci = this.clComponentInstance;
      if (!clci) return;
  console.log(clci.id)
      
      this.tag.value = this.getComponentRealName(clci); // BUG: 内部组件不可拖拽
      this.load_plugin(clci.cid)();
      
      this.componentData.on = clci.on;
      this.componentData.props = thia.makeProps(clci);
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
        this.load_plugin(id)();
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
    
    getTag(instance) {
      if (!instance.isInstance) {
        return { value: 'div' }; // 第一次渲染, 元素没有改变
      }
      if (instance.isContainer) {
        console.log(instance.id, instance.props, "?????")
        return { 
          value: 'cl-component-container2',
          props: {
            on : instance.on,
            props : this.makeProps(instance),
            style : instance.props.style,
          },
        };
      }
      return { 
        value : this.getComponentRealName(instance),
        props : {
          on : instance.on,
          props : this.makeProps(instance),
          style : instance.props.style,
        },
      };
    },
    
    makeProps(instance) {
      if (!instance.props.styleProp) {
        Object.defineProperty(instance.props, 'styleProp', {
          get() {
            return this.style;
          }
        });
      }
      
      if (!instance.props.rootConfig) {
        let _this = this;
        Object.defineProperty(instance.props, 'rootConfig', {
          get() {
            return _this.rootConfig;
          }
        });
      }
      return instance.props;
    },
    
    getComponentRealName(i) {
      return i.helpTag || i.component;
    },
    
    loadDepsComponentLib() {
      for (let i=0; i<this.nestedList.length; ++i) {
        let item = this.nestedList[i];
        let loader = this.load_plugin(item.cid);
        
        if (item.clid) {
          this.$store.commit('loadComponentsFromLibrary', [item.clid, loader]);
        } else {
          console.warn("Component not has libraryID attribute");
          loader();
        }
      }
    },
    
    // 加载设计时插件, 返回一个加载器函数.
    load_plugin(cid) {
      return ()=>{
        clib.makeComponentPluginLoader(cid, this.$options.components);
        this.$forceUpdate();
      };
    },
    
    save_requires(clid) {
      clib.saveLibRequires(clid, this.rootConfig.requires);
    },
  },
}
</script>

<style scoped>
.component-container {
  border: 1px dashed #ccc; padding: 8px; margin: 10px 2px; min-height: 30px;
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