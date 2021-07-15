<!-- Create By xBoson System -->

<template>
  <div class='page-design'>
    <div class='dd-footer' v-if='showtip()'>拖拽组件到这里</div>
    <cl-component-container 
      :nested-list='file.content.list' 
      :root-config='file.content.root'
      :is-root='true'
    />
  </div>
</template>

<script>
const tool = require("./tool.js");


class Style {
  constructor() {
    this.dom = document.createElement('style');
    this.mounted = false;
  }
  
  render(value) {
    let x = [];
    for (let id in value) {
      this._item(id, value[id], x);
    }
    this.dom.innerHTML = x.join('');
  }
  
  _item(id, s, x) {
    if (Object.keys(s.val) <= 0) return;
  
    x.push(s.prefix, id, '{');
    for (let k in s.val) {
      x.push(k, ':', s.val[k], ';');
    }
    x.push('}\n');
  }
  
  mount() {
    document.head.append(this.dom);
    this.mounted = true;
  }
  
  unmount() {
    this.dom.remove();
    this.mounted = false;
  }
}


export default {
  props: ['file'],
  
  data() {
    return {};
  },
  
  mounted() {
    //注释掉: TODO:将插件加载到局部
    // this.loadPlugins(); 
    this.loadContextStyles();
  },
  
  beforeDestroy() {
    this.removeContextStyles();
  },
  
  methods : {
    showtip() {
      return this.file.content.list.length == 0 && this.$store.state.showDropTip;
    },
    
    //TODO: 删除
    loadPlugins() {
      let p = this.file.content.root.plugins;
      if (p) {
        tool.loadPlugins(p);
      }
    },
    
    loadContextStyles() {
      let cs = new Style();
      cs.render(this.file.content.root.styles);
      cs.mount();
      this.$store.commit('setBindContextStyle', cs);
    },
    
    removeContextStyles() {
      let cs = this.$store.state.bindContextStyle[this.file._id];
      cs.unmount();
      this.$store.commit('clearBindContextStyle', this.file._id);
    },
  },
}
</script>

<style scoped>
.dd-footer {
  text-align: center; color: #999; padding: 0px 0; background-color: #eee; 
  width: calc(100% - 22px); font-size: 1.3em; position: absolute; margin:1px;
}
</style>