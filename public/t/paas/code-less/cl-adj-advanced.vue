<!-- Create By xBoson System -->

<template>
  <a-collapse :bordered="false" v-if='getFile() != null'>
    <a-collapse-panel key="0">
      <template v-slot:header><span class='title'>
        上下文样式
      </span></template>
      <cl-adj-context-style :value='getRoot().styles'/>
    </a-collapse-panel>
    
    <a-collapse-panel key="1">
      <template v-slot:header><span class='title'>
        变量定义
      </span></template>
      <cl-adj-vars :value='getRoot().vars'/>
    </a-collapse-panel>
    
    <a-collapse-panel key="2">
      <template v-slot:header><span class='title'>
        函数定义
      </span></template>
      <cl-adj-funcs :value='getRoot().funcs'/>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
const tool = require('./tool.js');

export default {
  components : tool.makeComponents([
    'cl-adj-context-style',
    'cl-adj-vars',
    'cl-adj-funcs',
  ]),
  
  methods: {
    getFile() {
      return this.$store.state.editFile;
    },
    
    getRoot() {
      let f = this.getFile();
      if (f) {
        return f.content.root;
      }
    },
    
    nextid() {
      return ++this.getRoot().id;
    },
  },
}
</script>

<style scoped>
.title {
  color: brown;
}
</style>