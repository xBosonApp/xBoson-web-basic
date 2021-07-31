<template></template>
<script>
const clib  = require("./component-library.js");
const crole = require("./component-role.js");
const tool  = require("./tool.js");
let pkey = 1;

export default {
  props: ['nestedList', 'rootConfig', 'containerTag'],
  
  //TODO: 可以预览但是更新效率低
  render(c) {
    const rootConfig = this.rootConfig;
    const _vm = this;
    
    const _children = (list)=>{
      return list.map((e, i)=>{
        if (!e.isInstance) return '';
        
        let tagName = this.getComponentRealName(e);
        let content = [];
        let config  = makeConfig(e, list, i);
        
        if (e.isContainer) {
          config.class['cl-component-container'] = true;
          this.loadDepsComponentLib(e.props.nestedList);
          content = _children(e.props.nestedList);
        } else {
          config.class['cl-draggable-item'] = true;
          if (!e.removeTxt) {
            content.push(e.txt);
          }
        }
        let cc = c(tagName, config, content); 
        return cc;
      });
    };
    
    function makeConfig(e, list, index) {
      let config  = {
        style     : e.props.style,
        props     : e.props,
        key       : e.id,
        'class'   : { 'cl-draggable-item-active': false }, 
        on        : { click }, // e.on ??
        nativeOn  : { click, mouseover, mouseout },
      };
      
      _vm.makeVirtualProp(config.props, 'styleProp', e.props.style);
      _vm.makeVirtualProp(config.props, 'rootConfig', rootConfig);
      config.on.click = click;
      
      function click(event) {
        if (event.target !== event.currentTarget) return;
        if (index >= 0) {
          _vm.setAdjComponent(list, index);
        }
      }
      
      function mouseover() {
        if (event.target !== event.currentTarget) return;
        config.class['cl-draggable-item-active'] = true;
      }
      
      function mouseout() {
        if (event.target !== event.currentTarget) return;
        config.class['cl-draggable-item-active'] = false;
      }
      return config;
    }
    
    if (this.containerTag) {
      let tagName = this.getComponentRealName(this.containerTag);
      let config = makeConfig(this.containerTag, this.nestedList, -1);
      return c(tagName, config, _children(this.nestedList));
    } 
    else {
      return c("div", {
        'class' : ['cl-root-component-container', 'cl-draggable-item'],
        key     : pkey++,
      }, _children(this.nestedList));
    }
  },
  
  data() {
    return {
      bindclass:{},
    };
  },
  
  created() {
    clib.init().then(()=>{
      this.loadDepsComponentLib(this.nestedList);
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
  
  methods: {
    makeVirtualProp(obj, name, val) {
      if (!obj[name]) {
        Object.defineProperty(obj, name, {
          get() { return val; }
        });
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
        this.bindclass[id]['cl-draggable-item-active'] = b;
      }
    },
    
    newDragClass(active, isContainer) {
      return { 
        'cl-draggable-item': !isContainer, 
        'cl-draggable-item-active': active,
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
      this.setAdjComponent(this.nestedList, index);
    },
    
    setAdjComponent(list, index) {
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
    
    loadDepsComponentLib(list) {
      for (let i=0; i<list.length; ++i) {
        let item = list[i];
        // let loader = 
        this.load_plugin(item.clid, item.cid)();
        
        // if (item.clid) {
        //   this.$store.commit('loadComponentsFromLibrary', [item.clid, loader]);
        // } else {
        //   console.warn("Component not has libraryID attribute");
        //   loader();
        // }
      }
    },
    
    // 加载设计时插件, 返回一个加载器函数.
    load_plugin(clid, cid) {
      return ()=>{
        return new Promise((ok, fail)=>{
          let _next = (state)=>{
            clib.makeComponentPluginLoader(cid, this.$options.components);
            if (state == 'load') this.$nextTick(()=>this.$forceUpdate());
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
};
</script>

<style scoped>
.cl-component-container {
  border: 1px dashed #ccc; padding: 20px 8px; margin: 20px 2px; min-height: 30px;
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