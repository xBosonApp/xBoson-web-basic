<!-- Create By xBoson System -->

<template>
  <el-button @click='copy'>复制代码</el-button>
</template>

<script>
export default {
  // text 要复制的代码
  props : ['text'],
  
  methods : {
    copy() {
      let inp = document.createElement('textarea')
      inp.value = this.text;
      document.body.appendChild(inp);
      inp.select();
      document.execCommand('Copy');
      inp.remove();
      this.$message.success('复制成功 "'+ this.text.substr(0, 10) +'..."');
    },
  }
}
</script>

<style>
</style>