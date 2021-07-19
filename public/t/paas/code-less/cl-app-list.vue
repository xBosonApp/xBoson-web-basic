<!-- Create By xBoson System -->

<template>
<div class='items-group cl-helf-h-screen cl-column-2'>
  <div class='first content'>
    <div class='items-group bs' v-for='(p, i) in list' >
      <a-button :key='i' @click='openApp(p)'>
        {{ p.name }}
      </a-button>
      <a-button icon='edit' @click='gotoRename(p)'></a-button>
      <a-button icon='delete' type='danger' @click='delApp(p._id)' v-if='showDelete'/>
    </div>
    <div v-if='list.length < 1' class='note'>
      没有应用数据
    </div>
  </div>
  
  <div class='content'>
    <a-tooltip title='创建应用' placement='top' @click='gotoCreate'>
      <a-button icon='plus'/>
    </a-tooltip>
    <a-tooltip title='删除组件库' placement='top'>
      <a-button icon='minus' @click='showDelete = !showDelete'/>
    </a-tooltip>
    
    <div class='note' v-if='showDelete'>
      应用删除后, 需要在平台 UI 管理中, 手动删除物理文件.
    </div>
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['data', 'next'],
  
  data() {
    return {
      showDelete : false,
      list : [],
    };
  },
  
  mounted() {
    this.getList();
  },
  
  methods: {
    getList() {
      tool.api('appdev', 'applist', {}, (err, ret)=>{
        if (err) return xv.popError('应用列表', err);
        this.list = ret.data;
      });
    },
    
    delApp(_id) {
      tool.api('appdev', 'appdel', {_id}, (err, ret)=>{
        if (err) return xv.popError('删除应用', err);
        
        let i = this.list.findIndex((p)=>{
          return p._id == _id;
        });
        if (i>=0) {
          this.list.splice(i, 1);
        }
      });
      this.showDelete = false;
    },
    
    gotoCreate() {
      this.data.createMode = 'create';
      this.data.app = null;
      this.$emit("change", "createApp");
    },
    
    gotoRename(app) {
      this.data.createMode = 'rename';
      this.data.app = app;
      this.$emit("change", "editApp");
    },
    
    openApp(app) {
      this.data.app = app;
      this.$emit("change", "appMenu");
    },
  },
}
</script>

<style scoped>
.bs { grid-template-columns: 1fr auto auto; margin-top: 2px; }
</style>