<!-- Create By xBoson System -->

<template>
<div class='main'>
  <div class='first content'>
    <div v-for='(clib, i) in list' class='items-group c'>
      <a-button @click='$emit("change", "openClib", {clib})'>{{ clib.name }}</a-button>
      <a-tooltip title='编辑组件'>
        <a-button icon='edit' @click='editCLib(clib)'/>
      </a-tooltip>
      <a-tooltip title='删除组件' v-if='showDelete'>
        <a-button icon='delete' type='danger' @click='delCLib(clib._id)'/>
      </a-tooltip>
    </div>
    <div v-if='list.length < 1' class='note'>
      没有可用的组件库
    </div>
  </div>
  
  <div class='content'>
    <a-tooltip title='创建组件' placement='top' @click='$emit("change", "createCLib")'>
      <a-button icon='plus'/>
    </a-tooltip>
    <a-tooltip title='删除组件' placement='top'>
      <a-button icon='minus' @click='showDelete = !showDelete'/>
    </a-tooltip>
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['data', 'next'],
  
  mounted() {
    this.updateList();
  },
  
  data() {
    return {
      list: [],
      showDelete: false,
    };
  },
  
  methods: {
    updateList() {
      tool.api('register', 'list_c_lib', {}, (err, ret)=>{
        if (err) return;
        this.list = ret.data;
      });
    },
    
    editCLib(clib) {
      this.$emit("change", "editCLib", {
        isModify : true,
        clib,
      });
    },
    
    delCLib(clid) {
      tool.api('register', 'del_c_lib', {clid}, (err, ret)=>{
        if (err) return this.next(err);
        this.updateList();
      });
    },
  },
}
</script>

<style scoped>
.main { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; min-height: 50vh; }
.first { border-right: 1px solid #eee; }
.content { padding: 20px 30px; }
.c { grid-template-columns: 1fr auto auto; margin: 2px; }
</style>