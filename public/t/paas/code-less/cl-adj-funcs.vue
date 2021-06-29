<!-- Create By xBoson System -->

<template>
<div>
  <cl-adj-context-basic
    :value='value'
    pname='函数'
    pid='fc$'
    configTitle='函数'
    configComponent='cl-func-config'
    configWidth='80%'
    :initItem='initItem'
    :createConfigData='createConfigData'
    @change='onChange'
  >
  </cl-adj-context-basic>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['value'],
  
  methods: {
    initItem(opt) {
      opt.innerRef = null;
      opt.type = 'code';
      opt.params = [];
      opt.code = tool.generateFunctionComments(opt) +'\n\n';
    },
    
    createConfigData(opt, id) {
      return { id, opt };
    },
    
    onChange() {
      this.$store.commit('setEditFileChanged', true);
    },
  },
}
</script>

<style scoped>
</style>