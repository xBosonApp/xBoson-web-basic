<!-- Create By xBoson System -->

<template>
  <a-collapse :bordered="false" v-if='file != null'>
    <a-collapse-panel key="0">
      <template v-slot:header><span class='title'>
        上下文样式
      </span></template>
      <cl-adj-context-style :value='root.styles'/>
    </a-collapse-panel>
    
    <a-collapse-panel key="1">
      <template v-slot:header><span class='title'>
        变量定义
      </span></template>
      <cl-adj-vars :value='root.vars'/>
    </a-collapse-panel>
    
    <a-collapse-panel key="2">
      <template v-slot:header><span class='title'>
        函数定义
      </span></template>
      <cl-adj-funcs :value='root.funcs'/>
    </a-collapse-panel>
    
    <a-collapse-panel key="2a">
      <template v-slot:header><span class='title'>
        参数属性定义
      </span></template>
    </a-collapse-panel>
    
    <a-collapse-panel key="2b">
      <template v-slot:header><span class='title'>
        计算属性定义
      </span></template>
    </a-collapse-panel>
    
    <a-collapse-panel key="2c">
      <template v-slot:header><span class='title'>
        侦听器定义
      </span></template>
    </a-collapse-panel>
    
    <a-collapse-panel key="3">
      <template v-slot:header><span class='title2'>
        初始化时函数调用列表
      </span></template>
      <cl-adv-functions-queue :arr='root.mounted' :funcs='root.funcs' name='mounted'/>
    </a-collapse-panel>  
  
    <a-collapse-panel key="4">
      <template v-slot:header><span class='title2'>
        销毁时函数调用列表
      </span></template>
      <cl-adv-functions-queue :arr='root.beforeDestroy' :funcs='root.funcs' name='beforeDestroy'/>
    </a-collapse-panel>  
    
    <div class='note' style='margin: 19px'>* 都是当前文件的属性配置</div>
  </a-collapse>
</template>

<script>
const tool = require('./tool.js');

export default {
  components : tool.makeComponents([
    'cl-adj-context-style',
    'cl-adj-vars',
    'cl-adj-funcs',
    'cl-adv-functions-queue',
  ]),
  
  computed: {
    file() {
      return this.$store.state.editFile;
    },
    
    root() {
      if (this.file) {
        return this.file.content.root;
      }
    },
  },
  
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
.title2 {
  color: coral;
}
</style>