<!-- Create By xBoson System -->

<template>
<div>
  <cl-adj-context-basic
    :value='value'
    pname='侦听器'
    pid='wt$'
    configTitle='侦听器'
    configComponent='cl-nc-watch'
    configWidth='80%'
    :initItem='initItem'
    :createConfigData='createConfigData'
    :addHook='onAdd'
    @change='onChange'
  >
  </cl-adj-context-basic>
  
  <a-modal
    title="侦听器"
    :visible="showInputName"
    @ok="inputNameOK"
    @cancel="showInputName = false"
  >
    <label>侦听器表达式:</label> 
    <a-input v-model='expr'/>
    <a-button @click='showVarSelect = true'>侦听变量</a-button>
  </a-modal>
  
  <a-drawer
    title="选择侦听变量"
    placement="right"
    :visible="showVarSelect"
    @close="showVarSelect = false"
  >
    <cl-list-vars :allowProps='true' @choose='chooseVar'/>
  </a-drawer>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['value'],
  components : tool.loadc('cl-list-vars'),
  
  data() {
    return {
      showInputName : false,
      expr : null,
      nameSuccess : null,
      showVarSelect : false,
      check : /^[_a-zA-z\$]+[_a-zA-z\$0-9\.]*$/,
    };
  },
  
  methods: {
    initItem(opt) {
      opt.code = '//\n// Function(nv, ov)\n// nv - 新值\n// ov - 旧值\n//\n';
    },
    
    createConfigData(opt, id) {
      return { id, opt };
    },
    
    onChange() {
      this.$store.commit('setEditFileChanged', true);
    },
    
    inputNameOK() {
      if (this.expr) {
        if (this.check.test(this.expr)) {
          this.showInputName = false;
          this.nameSuccess({id : this.expr});
          this.expr = null;
        } else {
          antd.message.error('不是有效的表达式');
        }
      } else {
        antd.message.error('表达式不能为空');
      }
    },
    
    chooseVar(id) {
      this.expr = id;
    },
    
    onAdd() {
      return new Promise((ok, fail)=>{
        this.nameSuccess = ok;
        this.showInputName = true;
      });
    },
  },
}
</script>

<style scoped>
</style>