<!-- Create By xBoson System -->

<template>
<div>
  <div v-for='c in vs' v-if='config.vspecial[c.attr]'>
    <div>{{ c.title }}</div>
    <cl-attr-bind-data
      v-model='config.vspecial[c.attr].value'
      :config='config.vspecial[c.attr].propsConfig'
      @change='fileChanged'
    />
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['config'],
  components : tool.loadc('cl-attr-bind-data'),
  
  data() {
    return {
      vs:[
        { title:'渲染条件表达式', attr:'v-if' },
        { title:'循环表达式', attr:'v-for'},
        { title:'组件实例唯一 Key', attr:'key' },
        { title:'DOM 引用', attr:'ref' },
      ],
    };
  },
}
</script>

<style scoped>
</style>