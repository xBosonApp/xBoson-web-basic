<!-- Create By xBoson System -->

<template>
  <div class='page-design'>
    <div class='dd-footer' v-if='showtip()'>拖拽组件到这里</div>
    <cl-component-container 
      :nested-list='file.content.list' 
      :root-config='file.content.root'
    />
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['file'],
  
  data() {
    return {};
  },
  
  mounted() {
    let p = this.file.content.root.plugins;
    if (p) {
      tool.loadPlugins(p);
    }
  },
  
  methods : {
    showtip() {
      return this.file.content.list.length == 0 && this.$store.state.showDropTip;
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