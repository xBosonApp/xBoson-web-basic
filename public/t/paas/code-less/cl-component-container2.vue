<!-- Create By xBoson System -->

<template>
  <DropList
    :tag='tag.name'
    :items='nestedList'
    :style='styleProp'
    :class="{ 'cl-component-container':!isRoot, 'cl-root-component-container': isRoot }"
    :row='true'
    :key='tag.id'
    
    :rootConfig='rootConfig'
    :nestedList='nestedList'
    :styleProp='styleProp'
    
    mode="cut"
    group-name='ui-component'
    --no-animations
    v-bind='tag.props'
    v-components-loader='$options.components'
    
    @insert="onInsert"
    @reorder="onReorder"
  > 
    <template v-slot:item="{item, reorder}">
      <Drag
        v-if='item.isInstance'
        v-components-loader='$options.components'
        v-bind='item.props'
        v-on='item.on'
        
        :tag='getTag(item)'
        :styleProp='item.props && item.props.style'
        :rootConfig='rootConfig'
        :class="bindClass[item.id]"
        :key='item.id'
        :clComponentInstance='item'
        :data='item'
        
        @cut="onRemove"
        @mouseover.native.self="setHover(item.id, true, item.isContainer)"
        @mouseout.native.self="setHover(item.id, false, item.isContainer)"
        @mouseover.self="setHover(item.id, true, item.isContainer)"
        @mouseout.self="setHover(item.id, false, item.isContainer)"
      >
        <span v-if='!(item.isContainer || item.removeTxt)' v-frag>
          {{ item.txt }}
        </span>
      </Drag>
      <div v-else></div>
    </template>
    
    <template v-slot:feedback>
      <div style='height: 10px' class='cl-drag-drop-component-ghost'></div>
    </template>
  </DropList>
</template>

<script>
const clib  = require("./component-library.js");
const crole = require("./component-role.js");
const tool  = require("./tool.js");
const dnd   = require("cdn/easy-dnd/0.1.0/loader.js");

export default {
  props: ['nestedList', 'styleProp', 'rootConfig', 'isRoot', 'clComponentInstance'],
  
  components: {
    Drag      : dnd.Drag,
    Drop      : dnd.Drop,
    DropList  : dnd.DropList,
  },
  
  data() {
    return {
      tag : { name:'div', props:{}, id:0 },
      bindclass:{},
    };
  },
  
  created() {
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
      
      // console.log(clci.id, clci)
      this.load_plugin(clci.cid)();
      this.tag.name = this.getComponentRealName(clci);// 导致子组件无法拖拽
      this.tag.props = clci.props;
      this.tag.id = clci.id;
      // console.log("cc", this.$options.components, this.tag)
    },
    
    setHover(id, b, isContainer) {
      if (this.bindclass[id] === undefined) {
        this.$set(this.bindclass, id, this.newDragClass(b, isContainer));
      } else {
        this.bindclass[id]['cl-draggable-item-active'] = b;
      }
    },
    
    newDragClass(active, isContainer) {
      return { 
        'cl-draggable-item': !isContainer, 
        'cl-draggable-item-active': active,
      };
    },
    
    onInsert(ev) {
      if (ev.data.isInstance) {
        this.nestedList.splice(ev.index, 0, ev.data);
      } else {
        console.log("init instance", ev, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      }
    },
    
    onRemove(ev) {
      let i = this.nestedList.indexOf(ev.data);
      this.nestedList.splice(i, 1);
    },
    
    onReorder(ev) {
      ev.apply(this.nestedList);
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
        return 'div'; // 第一次渲染, 元素没有改变
      }
      
      if (instance.isContainer) {
        return 'cl-component-container2';
      }
      
      return this.getComponentRealName(instance);
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
        // this.$forceUpdate();
      };
    },
    
    save_requires(clid) {
      clib.saveLibRequires(clid, this.rootConfig.requires);
    },
  },
}
</script>

<style>
.cl-component-container {
  border: 1px dashed #ccc; padding: 8px; margin: 10px 2px; min-height: 30px;
}
.cl-root-component-container {
  /*border: 1px dashed green;*/ padding: 20px 8px; min-height: 200px;
}
.cl-draggable-item {
  border: 1px dashed #f1f1f1; min-height: 5px;
}
.cl-draggable-item-active {
  border: 1px dashed #3e33e9 !important;
}
</style>