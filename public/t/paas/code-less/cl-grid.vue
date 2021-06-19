<!-- Create By xBoson System -->

<template>
  <cl-component-container 
    :style='styleProp'
    :nestedList='nestedList'
    :rootConfig='rootConfig'>
  </cl-component-container>
</template>

<script>
export default {
  // style 不会被透传, 重命名为 styleProp
  props: ['nestedList', 'styleProp', 'rows', 'columns', 'rootConfig'],
  watch : {
    rows(v) {
      this.styleProp['grid-template-rows'] = v.join(' ');
    },
    columns(v) {
      this.styleProp['grid-template-columns'] = v.join(' ');
    },
  },
}
</script>

<style>
</style>