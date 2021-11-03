<!-- Create By xBoson System -->

<template>
  <component 
    :nestedList="nestedList"
    :styleProp="styleProp"
    :rootConfig='rootConfig'
    
    :is='tag.name'
    :key='tag.id'
    :style='styleProp'
    :class="{ 'cl-component-container': !isRoot, 
              'cl-root-component-container': isRoot, 
              'cl-draggable-item': !isRoot }"
    
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
      :disabled.prop='false'
      :codelessDesignRuntime='true'
      @extendsData='saveExtendsData(e.id, $event)'
      
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
      
      @click='setAdjRef(idx, null, $event)'
      @click.native.self='setAdjRef(idx, null, $event)'
      @mouseover.native.self="setHover(e.id, true, e.isContainer)"
      @mouseout.native.self="setHover(e.id, false, e.isContainer)"
      @mouseover.self="setHover(e.id, true, e.isContainer)"
      @mouseout.self="setHover(e.id, false, e.isContainer)"
      
      @mouseleave.self="revertFreezeComponent(e)"
    >
      <span v-if='!(e.removeTxt)' v-frag>
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
    'cl-tag-info' : require("./cl-tag-info.vue", 1,1),
  },
  
  data() {
    return {
      tag : { name:'div', props:{}, id:pkey++, on:null },
      rootNode : { id:"root", isContainer:true, isRoot:this.isRoot },
      bindclass : {},
      draging : false,
      extendsData : {},
      errorMap: {},
    };
  },
  
  created() {
    clib.init().then(()=>{
      this.loadDepsComponentLib();
      this.initContainerInstanceTag();  
    });
  },
    
  //
  // 使用智能配置的文件再二次打开会抛出异常, 原因未知.
  // 经处理后可以恢复到可编辑状态.
  //
  errorCaptured(err, vm, info) {
    const thiz = this;
    let pvm = vm;
    let key = nextKey();
    let findIndex = null;
    
    while (key) {
      this.nestedList.forEach((n, i)=>{
        if (n.id == key) {
          findIndex = i;
        }
      });
      if (findIndex !== null) {
        // 冻结错误组件
        let c = this.nestedList[findIndex];
        c.tempFreeze = 'div';
        addError(c.id);
        this.$store.commit('clearAdjComponent');
        break;
      }
      key = nextKey(true);
    };
    
    if (findIndex >= 0) {
      // xv.popError("错误的组件被冻结: "+ key, err);
      console.warn("错误的组件被临时冻结: "+ key, err);
    } else {
      xv.popError("组件错误", err);
    }
    return false;
    
    function addError(id) {
      if (thiz.errorMap[id] >= 0) {
        thiz.errorMap[id]++;
      } else {
        thiz.errorMap[id] = 1;
      }
    }
    
    function nextKey(getparent) {
      if (getparent) pvm = pvm.$parent;
      
      for (;;) {
        if ((!pvm) || (!pvm.$vnode)) return;
        if (pvm.$vnode.key) return pvm.$vnode.key;
        pvm = pvm.$parent;
      }
    }
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
    revertFreezeComponent(e) {
      // 当组件错误超过 3 次后不再解冻
      if (this.errorMap[e.id] > 3) {
        xv.popError("错误的组件被冻结: "+ e.id);
        return;
      }
      e.tempFreeze = undefined;
    },
    
    onDragStart(ev, node, index) {
      this.draging = true;
      ev.target.classList.add('cl-draging');
      ev.target.style.border = '3px dotted green';
      
      let release = ()=>{
        this.nestedList.splice(index, 1);
      };
      
      let drapData = {
        node, index,
        release,
        list : this.nestedList, 
        el   : ev.target, 
        stop : false,
        dropNode : ()=>{},
      };
      
      let key = tool.saveData(drapData, DPRE);
      ev.dataTransfer.effectAllowed = 'copyMove';
      ev.dataTransfer.setData(key, 'true');
      ev.target.drapData = drapData;
      // console.debug('start', node.id, index, key);
    },
    
    onDragEnd(ev, node, index) {
      this.dropNode(ev.target.drapData);
      
      this.draging = false;
      ev.target.classList.remove('cl-draging');
      ev.target.style.border = '';
      ev.target.style.opacity = '1';
      ev.target.drapData = null;
      tool.clearData(DPRE);
      // console.debug('end', node.id, ev);
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
            // console.debug('move y', y<0.5, y, node.isRoot)
          }
        }
      } else {
        let x = ev.offsetX / ev.target.clientWidth;
        if (x > 0.1 && x < 0.9) {
          if (!this.isTargetParent(ev.target, d.el)) {
            moveTo(x <= 0.5 ?'beforebegin' :'afterend', 
              this.nestedList, this.nestedList == d.list ?index :(x<=0.5 ?index :index+1));
            // console.debug('move x', this.nestedList == d.list, x<=0.5)
          }
        }
      }
      
      function moveTo(pos_str, list, index) {
        // console.debug('over', node.id, index, d.stop, Date.now());
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
        setTimeout(()=>d.el.style.opacity = '1', 1);
        ev.preventDefault();
        d.stop = 0;
        if (!d.node.isInstance) {
          ev.dataTransfer.dropEffect = 'copy';
        }
        d.dropNode = this.dropNode;
        // console.debug('enter', node.id, node.isRoot, index, d.node.id);
      }
    },
    
    onDragLeave(ev, node, index) {
      // console.debug("leave", node.id, index);
      let d = this.loadData(ev.dataTransfer);
      if (d) {
        d.el.style.opacity = '0.1';
      }
    },
    
    onDrop(ev, node, index) {
      //let d = this.loadData(ev.dataTransfer);
      //dropNode(d);
      ev.dataTransfer.dropEffect = 'copy';
    },
    
    dropNode(drapData) {
      const d = drapData;
      
      if (d && d.moveTo && d.moveTo.list) {
        if (!d.node.isInstance) {
          d.release();
          this.initComponent(d.node.id, d.moveTo.index, d.moveTo.list);
          // console.log('drop new instance', d.node.id);
        } else {
          d.release();
          d.moveTo.list.splice(d.moveTo.index, 0, d.node);  
          // console.debug("drop inst", node.id)
        }
        this.fileChanged();
        tool.clearData(DPRE);
      } else {
        console.warn("Cancel drop");
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
      this.tag.name = this.getComponentRealName(clci);
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
    
    setAdjRef(index, _list, _event) {
      let list = _list || this.nestedList;
      let cfg = list[index];
      this.$store.commit('setAdjustmentComponent', cfg);
      this.$store.commit('setNestedItemRef', { list, index });
      
      let ext = this.extendsData[cfg.id];
      if (ext) {
        this.$store.commit('setAdjustmentComponentExt', ext);  
      }
      
      if (_event && _event.target) {
        this.$store.commit('setAdjustmentComponentView', _event.target);
      }
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
      return i.tempFreeze || i.helpTag || i.component;
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
    
    // 组件通过发出 extendsData 事件来发送扩展数据, 
    // 只有定制属性编辑器可以读取这些扩展数据,
    // 通过 this.$store.state.currentAdjustmentComponentExt
    saveExtendsData(id, data) {
      this.extendsData[id] = data;
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
  border: 1px dashed #eee; min-height: 5px; cursor: grab; padding: 20px 2px;
}
.cl-draggable-item-active {
  border: 1px dashed #3e33e9 !important; cursor: pointer;
}
.cl-draging {
  cursor: grabbing; border: 3px dotted green !important; opacity: 0.5;
}
</style>