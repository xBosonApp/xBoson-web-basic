<!-- Create By xBoson System -->

<template>
<div>
  <cl-adj-context-basic
    :value='value'
    pname='变量'
    pid='v$'
    configTitle='变量'
    configComponent='cl-var-config'
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
      opt.type = 'String';
      opt.def = '';
    },
    
    createConfigData(opt, id) {
      return { id, opt };
    },
  },
}
</script>

<style scoped>
</style>