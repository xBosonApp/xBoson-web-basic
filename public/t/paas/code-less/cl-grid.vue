<!-- Create By xBoson System -->

<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  // style 不会被透传, 重命名为 styleProp
  props: ['nestedList', 'styleProp', 'rows', 'columns', 'rootConfig', 'rowGap', 'columnGap'],
  
  watch : {
    rows(v) {
      console.log('v', v)
      this.styleProp['grid-template-rows'] = v.join(' ');
    },
    columns(v) {
      console.log('c', v);
      this.styleProp['grid-template-columns'] = v.join(' ');
    },
    rowGap(v) {
      console.log('rg', v);
      this.styleProp['row-gap'] = v;
    },
    columnGap(v) {
      console.log('cg', v);
      this.styleProp['column-gap'] = v;
    },
  },
  
  mounted() {
    return;
    setTimeout(()=>{
      console.log("cl-grid init");
      let a = ['nestedList', 'styleProp', 'rows', 'columns', 'rootConfig', 'rowGap', 'columnGap'];
      a.forEach(n=>{
        console.log('\t', n, this[n]);
      });
    }, 2000);
  },
}
</script>

<style>
</style>