<!-- Create By xBoson System -->

<template>
  <div class='page-design'>
    <cl-device-emu v-if='pageSet.hasBorder' :setting='pageSet' style='margin-left: 20px;'>
      <div class='dd-footer cl-background-flanel-lines cl-vertical-center' v-if='showtip()'>
        <b>拖拽组件到这里</b>
      </div>
      <cl-component-container 
        :nested-list='file.content.list' 
        :root-config='file.content.root'
        :is-root='true'
      />
    </cl-device-emu>
    
    <div v-else>
      <div class='dd-footer cl-background-flanel-lines cl-vertical-center' v-if='showtip()'>
        <b>拖拽组件到这里</b>
      </div>
      <cl-component-container 
        :nested-list='file.content.list' 
        :root-config='file.content.root'
        :is-root='true'
      />
    </div>
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
  
  components: tool.loadc('cl-device-emu'),
  
  data() {
    return {};
  },
  
  computed: {
    pageSet() {
      return this.file.content.root.pageSetting || {index:{}};
    },
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
    
    //TODO: 已经禁用, 即将删除
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
  margin: 10px; width: calc(100% - 20px); font-size: 1.3em; position: absolute; height: 180px; 
}
.dd-footer b {
  display: inline-block; padding: 10px 30px; background: #fff; border: 1px dashed #eee; color: #2f66af;
}
</style>