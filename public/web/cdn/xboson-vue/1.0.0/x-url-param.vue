<!-- Create By xBoson System -->

<template></template>

<script>
export default {
  props: ['value'],
  
  mounted() {
    let url = new URL(document.location);
    let ret = this.value || {};
    
    url.searchParams.forEach((v, k)=>{
      ret[k] = v;
    });
    
    this.$emit('input', ret);
  },
}
</script>

<style scoped>
</style>