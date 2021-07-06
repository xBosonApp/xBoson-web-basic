<!-- Create By xBoson System -->

<template>
<div>
  <cl-adj-context-basic
    :value='value'
    pname='计算'
    pid='cp$'
    configTitle='计算属性'
    configComponent='cl-nc-compute-props'
    :initItem='initItem'
    :createConfigData='createConfigData'
    @change='onChange'
    configWidth='80%'
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
      opt.scode = '//\n// Function setter(v)\n//  v - 设置的值\n//\n';
      opt.gcode = '//\n// Function getter()\n//\n return 返回属性值//\nreturn;';
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