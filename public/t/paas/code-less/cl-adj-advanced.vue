<!-- Create By xBoson System -->

<template>
  <a-collapse :bordered="false" v-if='getFile() != null'>
    <a-collapse-panel key="0" header="上下文样式">
      <cl-adj-context-style :value='getRoot().styles'/>
    </a-collapse-panel>
    <a-collapse-panel key="1" header="变量定义">
      <!--<cl-adj-vars :value='getRoot().vars'/>-->
    </a-collapse-panel>
    <a-collapse-panel key="2" header="函数定义">
      <!--<cl-adj-funcs :value='getRoot().funcs'/>-->
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
const tool = require('./tool.js');
Vue.component('cl-adj-context-basic', require('./cl-adj-context-basic.vue', 1, 1));

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
</style>