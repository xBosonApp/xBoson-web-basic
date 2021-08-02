<!-- Create By xBoson System -->

<template>
  <component 
    :nestedList="nestedList"
    :styleProp="styleProp"
    :rootConfig='rootConfig'
    
    :style='styleProp'
    :class="{ 'cl-component-container': !isRoot, 
              'cl-root-component-container': isRoot, 
              'cl-draggable-item': !isRoot }"
    :is='tag.name'
    :key='tag.id'
    
    v-bind='tag.props'
    v-on='tag.on'
    
    @dragenter.self='isRoot && onDragEnter($event, rootNode, 0)'
    @dragleave.self='isRoot && onDragLeave($event, rootNode, 0)'
    @dragover.self='isRoot && onDragOver($event, rootNode, 0)'
    @drop.self='isRoot && onDrop($event, rootNode, 0)'
  >
    <component 
      v-bind='e.props'
      v-on='e.on'
      v-for="(e, idx) in nestedList" 
      v-if='e.isInstance'
      
      :is='getComponentName(e)' 
      :class="bindClass[e.id]"
      :key='e.id'
      :styleProp='e.props && e.props.style'
      :rootConfig='rootConfig'
      :containerTagInfo='e.isContainer && e'
      :isRoot='false'
      
      :draggable.prop="true"
      @dragstart.stop='onDragStart($event, e, idx)'
      @dragend.stop='onDragEnd($event, e, idx)'
      @dragover.stop='onDragOver($event, e, idx)'
      @dragenter.stop='onDragEnter($event, e, idx)'
      @dragleave.stop='onDragLeave($event, e, idx)'
      @drop.stop='onDrop($event, e, idx)'
      
      @dragstart.native.self='onDragStart($event, e, idx)'
      @dragend.native.self='onDragEnd($event, e, idx)'
      @dragover.native.self='onDragOver($event, e, idx)'
      @dragenter.native.self='onDragEnter($event, e, idx)'
      @dragleave.native.self='onDragLeave($event, e, idx)'
      @drop.native.self='onDrop($event, e, idx)'
      
      @click='setAdjRef(idx)'
      @click.native.self='setAdjRef(idx)'
      @mouseover.native.self="setHover(e.id, true, e.isContainer)"
      @mouseout.native.self="setHover(e.id, false, e.isContainer)"
      @mouseover.self="setHover(e.id, true, e.isContainer)"
      @mouseout.self="setHover(e.id, false, e.isContainer)"
    >
      <span v-if='!(e.isContainer || e.removeTxt)' v-frag>
        {{ e.txt }}
      </span>
    </component>
    
  </component>
</template>

<script>
const NoConflictID = '_3iofdEEnwa0jfdsaFESAldfdsa__'+ Math.random().toString(16).substr(2);
const DPRE  = 'component-container-drag-data';
const clib  = require("./component-library.js");
const crole = require("./component-role.js");
const tool  = require("./tool.js");
let pkey = 1;

export default {
  props: ['nestedList', 'styleProp', 'rootConfig', 'isRoot', 'containerTagInfo'],
  
  components: {
  },
  
  data() {
    return {
      tag : { name:'div', props:{}, id:pkey++, on:null },
      rootNode : { id:"root", isContainer:true, isRoot:this.isRoot },
      bindclass : {},
      draging : false,
    };
  },
  
  created() {
    clib.init().then(()=>{
      this.loadDepsComponentLib();
      this.initContainerInstanceTag();  
    });
  },
  
  mounted() {
  },
    
  errorCaptured(err, vm, info) {
    // console.warn(info, err, vm, vm.$vnode.context );
    xv.popError("组件错误: "+ vm.$vnode.data.key, err);
    vm.$vnode.context.tag.name = 'div';
    return false;
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
    onDragStart(ev, node, index) {
      this.draging = true;
      ev.target.classList.add('cl-draging');
      ev.target.style.border = '3px dotted green';
      
      let release = ()=>{
        this.nestedList.splice(index, 1);
      };
      
      let key = tool.saveData({
        node, index,
        release,
        list : this.nestedList, 
        el   : ev.target, 
        stop : false,
      }, DPRE);
      
      ev.dataTransfer.effectAllowed = 'copyMove';
      ev.dataTransfer.setData(key, 'true');
      // console.log('start', node.id, index, key);
    },
    
    onDragEnd(ev, node, index) {
      this.draging = false;
      ev.target.classList.remove('cl-draging');
      ev.target.style.border = '';
      tool.clearData(DPRE);
      // console.log('end', node.id, ev);
    },
    
    onDragOver(ev, node, index) {
      ev.preventDefault();
      
      let d = this.loadData(ev.dataTransfer);
      if ((ev.pageX == d.pagex) && (ev.pageY == d.pagey)) {
        return false;
      }
      d.pagex = ev.pageX;
      d.pagey = ev.pageY;
      if ((d.node == node) || (d.stop > Date.now())) {
        return false;
      }
      
      let onContainer = false;
      if (node.isContainer) {
        if (d.onContainerId == node.id) {
          onContainer = Date.now() - d.onContainerCnt > 200;
        } else {
          d.onContainerCnt = Date.now();
          d.onContainerId = node.id;
        }
      }
      
      if (onContainer || node.isRoot) {
        let y = ev.offsetY / ev.target.clientHeight;
        if (y < 0.2 || y > 0.8) {
          if (!this.isTargetParent(ev.target, d.el)) {
            moveTo(y < 0.5 ?'afterbegin' :'beforeend',
              node.isRoot ?this.nestedList :node.props.nestedList, index);
            // console.log('move y', y<0.5, y)
          }
        }
      } else {
        let x = ev.offsetX / ev.target.clientWidth;
        if (x > 0.1 && x < 0.9) {
          if (!this.isTargetParent(ev.target, d.el)) {
            moveTo(x <= 0.5 ?'beforebegin' :'afterend', 
              this.nestedList, this.nestedList == d.list ?index :(x<=0.5 ?index :index+1));
            // console.log('move x', x<=0.5)
          }
        }
      }
      
      function moveTo(pos_str, list, index) {
        // console.log('over', node.id, index, d.stop, Date.now());
        ev.target.insertAdjacentElement(pos_str, d.el);
        d.stop = Date.now() + 500;
        d.moveTo = { list, index };
        d.el.animate([{ opacity: '0' }, { opacity: '1' }], { duration: 200 });
      }
      return false;
    },
    
    // 拖放到被接受节点上的事件
    onDragEnter(ev, node, index) {
      if (node.isRoot) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
      }
      
      let d = this.loadData(ev.dataTransfer);
      if (d) {
        ev.preventDefault();
        d.stop = 0;
        if (!d.node.isInstance) {
          ev.dataTransfer.dropEffect = 'copy';
        }
        // console.log('enter', node.id, node.isRoot, index, d.node.id);
      }
    },
    
    onDragLeave(ev, node, index) {
      // console.log("leave", node.id, index);
      // let d = this.loadData(ev.dataTransfer);
    },
    
    onDrop(ev, node, index) {
      let d = this.loadData(ev.dataTransfer);
      // console.log('drop', d.node.id);
      
      if (d.moveTo && d.moveTo.list) {
        if (!d.node.isInstance) {
          d.release();
          this.initComponent(d.node.id, d.moveTo.index, d.moveTo.list);
          // console.log('drop new instance', d.node.id);
        } else {
          d.release();
          d.moveTo.list.splice(d.moveTo.index, 0, d.node);  
          // console.log("drop inst")
        }
        ev.dataTransfer.dropEffect = 'copy';
        this.fileChanged();
      } else {
        console.warn("Cancel drop", node.id, index);
      }
    },
    
    // 如果 parent 是 target 的父容器, 返回 true
    isTargetParent(target, parent) {
      const oid = target.id;
      try {
        target.id = NoConflictID;
        return parent.querySelector('#'+ NoConflictID) != null;
      } finally {
        target.id = oid;
      }
    },
    
    loadData(dataTransfer) {
      let t = dataTransfer.types;
      for (let i=0; i<t.length; ++i) {
        if (t[i].startsWith(DPRE)) {
          return tool.loadData(t[i]);
        }
      }
    },
    
    initContainerInstanceTag() {
      let clci = this.containerTagInfo;
      if (!clci) return;
      
      // console.log(clci.id, clci)
      this.load_plugin(clci.clid, clci.cid)();
      this.tag.name = this.getComponentRealName(clci);// 导致子组件无法拖拽
      this.tag.props = clci.props;
      this.tag.on = clci.on;
      this.tag.id = clci.id;
      // console.log("cc", this.$options.components, this.tag)
    },
    
    setHover(id, b, isContainer) {
      if (this.bindclass[id] === undefined) {
        this.$set(this.bindclass, id, this.newDragClass(b, isContainer));
      } else {
        this.bindclass[id]['cl-draggable-item-active'] = this.draging ? false : b;
      }
    },
    
    newDragClass(active, isContainer) {
      return { 
        'cl-draggable-item': !isContainer, 
        'cl-draggable-item-active': active,
      };
    },
    
    initComponent(id, index, _list) {
      let list = _list || this.nestedList;
      let component = clib.getComponent(id);
      if (component.plugins) {
        this.load_plugin(component.clid, id)();
      }
      this.save_requires(component.clid);
      
      let instance = crole.createInstance(this.rootConfig, component);
      // this.$set(list, index, instance);
      list.splice(index, 0, instance);
      this.$store.commit('setEditFileChanged', true);
      this.setAdjRef(index, list);
      return instance;
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
    
    fileChanged() {
      this.$store.commit('setEditFileChanged', true);
    },
    
    setAdjRef(index, _list) {
      let list = _list || this.nestedList;
      let cfg = list[index];
      this.$store.commit('setAdjustmentComponent', cfg);
      this.$store.commit('setNestedItemRef', { list, index });
    },
    
    // 必须调用该方法, 否则直接用 component 属性会产生数组错位
    getComponentName(instance) {
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
        return new Promise((ok, fail)=>{
          let _next = (state)=>{
            clib.makeComponentPluginLoader(cid, this.$options.components);
            this.$forceUpdate();
            ok();
          };
          this.$store.commit('loadComponentsFromLibrary', [clid, _next]);
        });
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
  border: 1px dashed #ccc; padding: 20px 8px; margin: 20px 2px; min-height: 30px;
}
.cl-root-component-container {
  /*border: 1px dashed green;*/ padding: 20px 8px; min-height: 200px;
}
.cl-draggable-item {
  border: 1px dashed #eee; min-height: 5px; cursor: grab;
}
.cl-draggable-item-active {
  border: 1px dashed #3e33e9 !important;
}
.cl-draging {
  cursor: grabbing; border: 3px dotted green !important; opacity: 0.5;
}
</style>