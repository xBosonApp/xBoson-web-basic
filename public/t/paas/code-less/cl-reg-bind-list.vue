<!-- Create By xBoson System -->

<template>
<div class='items-group main'>
  <div class='group content'>
    <div v-for='(g, n) in group' :key='n'>
      <div class='cl-classify'>{{ g.name }} <span v-if='g.hangUp'>!</span></div>
      <div class='items-group list'>
        <span v-for='(c, i) in g.list' :key='i' class='componentItem' 
          @click='selectC = c'>{{ c.txt }}</span>
      </div>
    </div>
  </div>
  <div class='content'>
    <h3>
      <span class='cname'>组件库: {{ data.clib.name }} </span>
      <span v-if='data.clib.isGlobal' class='note'>全局共享</span>
      <span v-else class='note'>只在当前项目中使用</span>
    </h3>
    <div>
      <a-tooltip title='绑定组件'>
        <a-button type='primary' @click='createBind' icon='plus'/>
      </a-tooltip>
      <a-tooltip title='编辑组件'>
        <a-button @click='onEdit' :disabled='selectC == null' icon='edit'/>
      </a-tooltip>
      <a-tooltip title='编辑属性'>
        <a-button @click='onPropEdit' :disabled='selectC == null' icon='menu-unfold'/>
      </a-tooltip>
      <a-tooltip title='删除组件'>
        <a-button @click='showDelete = true' :disabled='selectC == null' icon='delete'/>
      </a-tooltip>
      <a-tooltip title='返回'>
        <a-button @click='$emit("change", "default")' icon='rollback'/>
      </a-tooltip>
    </div>
    <h4 v-if='selectC != null' style='margin-top: 10px'>
      <span>选中的组件:</span>
      <span>{{ selectC.txt }}</span>
    </h4>
    <div v-if='showDelete' style='margin-top: 20px'>
      <div>删除组件 {{ selectC.txt }} ?</div>
      <a-button @click='onDelete' type='danger'>删除</a-button>
      <a-button @click='showDelete = false'>取消</a-button>
    </div>
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['data', 'next'],
  
  mounted() {
    this.getList();
  },
  
  data() {
    let group = {};
    this.data.clib.groups.forEach(n=>{
      group[n] = this.createGroup(n);
    });
    
    return {
      group,
      showDelete: false,
      selectC: null,
    };
  },
  
  methods: {
    createBind() {
      this.data.isModifyBind = false;
      this.$emit("change", "createBind");
    },
    
    getList() {
      let parm = { clid: this.data.clib._id };
      tool.api('register', 'list_c_bind', parm, (err, ret)=>{
        if (err) return this.next(err);
        
        ret.data.forEach(b=>{
          let g = this.group[b.groupName];
          if (!g) {
            g = this.group[b.groupName] = this.createGroup(b.groupName, true);
          }
          g.list.push(b);
        });
      });
    },
    
    clearGroup() {
      for (let n in this.group) {
        this.group[n].list.splice(0);
      }
    },
    
    createGroup(name, isHangUp) {
      return {
        name, 
        list   : [],
        hangUp : !!isHangUp,
      };
    },
    
    onDelete() {
      let parm = { _id: this.selectC._id, clid: this.data.clib._id };
      tool.api('register', 'del_c_bind', parm, (err, ret)=>{
        if (err) return this.next(err);
        this.showDelete = false;
        this.clearGroup();
        this.getList();
      });
    },
    
    onEdit() {
      this.$emit('change', 'createBind', { bind: this.selectC, isModifyBind: true });
    },
    
    onPropEdit() {
      this.$emit('change', 'editProps', { bind: this.selectC });
    },
  },
}
</script>

<style scoped>
.main {
  grid-template-columns: 340px 1fr; min-height: 300px;
}
.list {
  grid-template-columns: 1fr 1fr; gap: 5px; margin: 4px;
}
.cname {
  margin-right: 10px;
}
.componentItem {
  display: inline-block; border: 1px dashed #ddd; padding: 2px 5px;
}
</style>