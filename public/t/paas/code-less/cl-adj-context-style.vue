<!-- Create By xBoson System -->

<template>
  <cl-adj-context-basic
    :value='value'
    pname='样式'
    pid='s_'
    configTitle='上下文样式设置'
    configComponent='cl-style-adj'
    :initItem='initItem'
    :createConfigData='createConfigData'
  />
</template>

<script>
export default {
  props: ['value'],
  
  methods: {
    initItem(opt) {
      opt.val = {};
      opt.prefix = '.';
    },
    
    createConfigData(opt) {
      return { styleVal: opt.val };
    },
  },
}
</script>

<style scoped>
</style>