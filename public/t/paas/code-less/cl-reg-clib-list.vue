<!-- Create By xBoson System -->

<template>
<div class='items-group main'>
  <div class='first content'>
    <div v-for='(clib, i) in list' class='items-group c'>
      <a-button @click='$emit("change", "openClib", {clib})'>{{ clib.name }}</a-button>
      <a-button icon='edit' @click='editCLib(clib)' v-if='showEdit'/>
      <a-button icon='delete' type='danger' @click='delCLib(clib._id)' v-if='showDelete'/>
    </div>
    <div v-if='list.length < 1' class='note'>
      没有可用的组件库
    </div>
  </div>
  
  <div class='content'>
    <a-tooltip title='编辑组件库信息' placement='top'>
      <a-button icon='edit' @click='showEdit = !showEdit'/>
    </a-tooltip>
    <a-tooltip title='创建组件库' placement='top' @click='$emit("change", "createCLib")'>
      <a-button icon='plus'/>
    </a-tooltip>
    <a-tooltip title='删除组件库' placement='top'>
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
      showEdit: false,
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
        ret : null,
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
.main { grid-template-columns: 1fr 1fr; gap: 5px; min-height: 50vh; }
.c { grid-template-columns: 1fr auto auto; margin: 2px; }
</style>