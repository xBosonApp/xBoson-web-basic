<!-- Create By xBoson System -->

<template>
<div>
  <cl-adj-context-basic
    :value='value'
    pname='属性'
    pid='v$'
    configTitle='参数属性'
    configComponent='cl-nc-arg-props'
    :initItem='initItem'
    :createConfigData='createConfigData'
    :addHook='add'
    @change='onChange'
  >
  </cl-adj-context-basic>
  
  <a-modal
    title="输入属性名"
    :visible="showInputName"
    @ok="inputNameOK"
    @cancel="showInputName = false"
  >
    属性名: <a-input v-model='propName'/>
  </a-modal>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['value'],
  
  data() {
    return {
      showInputName : false,
      propName : null,
      addSuccess : null,
    };
  },
  
  methods: {
    initItem(opt) {
      opt.type = 'String';
      opt.def = '';
      opt.required = true;
    },
    
    createConfigData(opt, id) {
      return { id, opt };
    },
    
    onChange() {
      this.$store.commit('setEditFileChanged', true);
    },
    
    add() {
      return new Promise((ok, fail)=>{
        this.addSuccess = ok;
        this.showInputName = true;
      });
    },
    
    inputNameOK() {
      if (this.propName) {
        if (!tool.checkVar.test(this.propName)) {
          antd.message.error('参数 '+ this.propName +' 不是有效的变量名');
          return;
        }
        if (this.value[this.propName]) {
          antd.message.error('参数 '+ this.propName +' 已定义');
          return;
        }
        this.showInputName = false;
        this.addSuccess({id : this.propName});
        this.propName = null;
      } else {
        antd.message.error('参数名不能为空');
      }
    },
  },
}
</script>

<style scoped>
</style>