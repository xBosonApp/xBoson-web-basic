<!-- Create By xBoson System -->

<template>
<div>
  <draggable 
    :group="group" 
    :list="arr"
    animation='100' 
  >
    <div v-for='(n, i) in arr' :key='i' class='items-group'>
      <div class='i n'>{{ funcs[n].name }}</div>
      <a-button type="danger" icon='delete' class='i' @click='remove(i)'/>
    </div>
  </draggable>
  
  <cl-add-button @click='showAdd = true' title='加入函数'></cl-add-button>
  
  <a-drawer
    title="选择函数"
    placement="right"
    :visible="showAdd"
    @close="showAdd = false"
  >
    <cl-list-funcs @choose='add'/>
  </a-drawer>
  
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['funcs', 'arr', 'name'],
  components : tool.loadc("cl-list-funcs"),
  
  data() {
    return {
      group : { name: 'func-queue-'+ this.name },
      showAdd : false,
    };
  },
  
  methods: {
    add(id, cfg) {
      if (cfg.params && cfg.params.length) {
        antd.message.error("不能引用带有参数的函数");
        return;
      }
      this.arr.push(id);
      antd.message.success("已经加入");
    },
    
    remove(i) {
      this.arr.splice(i, 1);
    },
  },
}
</script>

<style scoped>
.items-group {
  grid-template-columns: 1fr 32px; margin-bottom: 2px; gap: 0; cursor: move;
}
.n {
  border-color: #ddd; padding: 5px 0 0 10px;
}
</style>