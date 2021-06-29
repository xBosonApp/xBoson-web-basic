<!-- Create By xBoson System -->

<template>
  <div>
    <a-collapse :bordered="false">
      <a-collapse-panel>
        <template #header>
          <span class='header'>绑定上下文样式</span>
        </template>
        <div v-for='(use, id) in config.bindStyle' class='col'>
          <div v-if='use' class='name'>{{ getName(id) }}</div>
          <a-button v-if='use' icon='delete' @click='del(id)' type='danger'></a-button>
        </div>
        <cl-add-button title='添加绑定' @click='add'/>
      </a-collapse-panel>
    </a-collapse>
  
    <a-drawer
      title="选择要绑定的上下文样式"
      placement="right"
      :visible="showBindList"
      @close="showBindList = false"
      :destroyOnClose='true'>
      <cl-context-style-choose @choose='choose'/>
    </a-drawer>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['config'],
  
  components : tool.loadc(['cl-context-style-choose']),
  
  data() {
    return {
      showBindList: false,
    };
  },
  
  computed: {
    bindStyle() {
      if (!this.config.bindStyle) {
        this.$set(this.config, 'bindStyle', {});
      }
      return this.config.bindStyle;
    },
  },
  
  methods: {
    add() {
      this.showBindList = true;
    },
    
    getName(id) {
      let s = tool.getRoot().styles[id];
      if (s) {
        return s.name;
      } else {
        this.del(id);
      }
    },
    
    del(id) {
      this.$set(this.config.bindStyle, id, false);
      this.$nextTick(()=>{
        this.$delete(this.config.bindStyle, id);
      });
    },
    
    choose(id) {
      if (this.bindStyle[id]) {
        this.$message.warning('重复绑定');
      } else {
        this.$set(this.bindStyle, id, true);
        this.$message.success('绑定完成');
      }
    },
  },
}
</script>

<style scoped>
.col {
  display: grid; grid-template-columns: 1fr 32px; margin: 2px 0;
}
.name {
  border-bottom: 1px solid #ccc; padding-top: 8px;
}
.header {
  color: #0000ba;
}
</style>