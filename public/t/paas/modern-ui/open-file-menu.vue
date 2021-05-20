<!-- Create By xBoson System -->

<template>
  <el-menu  background-color="#796547"
            text-color="#ffffff"
            active-text-color="#ffd04b"
            @select='openPage'>
    <slot></slot>
  </el-menu>
</template>

<script>
export default {
  props : ['dir'],
  
  methods : {
    openPage(id) {
      // console.log(this.dir, id)
      let path = ['./', this.dir, '/', id, '.vue'].join('');
      // let mod = require(path);
      // this.$emit("change-content", mod, id);
      this.$store.commit("changeContent", {path, id});
    }
  }
}
</script>

<style>
</style>