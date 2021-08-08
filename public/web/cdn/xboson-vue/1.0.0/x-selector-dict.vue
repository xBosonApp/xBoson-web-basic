<!-- Create By xBoson System -->

<template>
<div>
  <div class='title'>字典选择</div>
</div>
</template>

<script>
export default {
  props: ['value', 'org'],
  
  data() {
    return {
      tree: [],
    };
  },
  
  methods: {
    update() {
      let url = xv.ctx_prefix +'/app/'+ this.org +'/d2c8511b47714faba5c71506a5029d94/datadict/gettree';
      let parm = {};
      this.$api(url, parm).then(ret=>{
        console.log(ret);
      });
    },
  },
}
</script>

<style scoped>
.title {
  font-weight: bold; border-bottom: 1px dashed #ccc;
}
</style>