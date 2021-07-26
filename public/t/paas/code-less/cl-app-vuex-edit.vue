<!-- Create By xBoson System -->

<template>
  <div class='items-group m'>
    <x-ace v-model='code' language='javascript' class='content'/>
    <div class='content'>
      <a-button type='primary' @click='saveCode'>保存</a-button>
      <a-button @click='cancel'>返回</a-button>
    </div>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['data', 'next'],
  
  data() {
    return {
      code : '',
    };
  },
  
  mounted() {
    this.loadCode();
  },
  
  methods: {
    loadCode() {
      let parm = { _id : this.data.app._id, file: 'store.js' };
      tool.api('appdev', 'fileload', parm, (err, ret)=>{
        if (err) return this.next(err);
        this.code = ret.content;
      });
    },
    
    saveCode() {
      let parm = { _id : this.data.app._id, file: 'store.js', text: this.code };
      tool.api('appdev', 'filesave', parm, (err, ret)=>{
        if (err) return xv.popError('保存文件', err);
        antd.message.success(ret.msg);
      });
    },
    
    cancel() {
      this.next();
    },
  },
}
</script>

<style scoped>
.m {
  height: calc(100vh - 240px); grid-template-columns: 1fr auto;
}
</style>