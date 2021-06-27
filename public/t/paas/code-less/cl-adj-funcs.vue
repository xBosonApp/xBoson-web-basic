<!-- Create By xBoson System -->

<template>
<div>
  <cl-adj-context-basic
    :value='value'
    pname='函数'
    pid='fc$'
    configTitle='函数'
    configComponent='cl-func-config'
    :initItem='initItem'
    :createConfigData='createConfigData'
  >
  </cl-adj-context-basic>
</div>
</template>

<script>
export default {
  props: ['value'],
  
  methods: {
    initItem(opt) {
      opt.innerRef = null;
      opt.code = null;
      opt.type = 'code';
    },
    
    createConfigData(opt, id) {
      return { id, opt };
    },
  },
}
</script>

<style scoped>
</style>