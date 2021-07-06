<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <x-ace v-model='opt.code' language='javascript' @editHandle='setEditor'></x-ace>
    <div>
      <h3>
        <span class='note'>侦听: </span> 
        <span class='gap'>{{ id }}</span> 
        <span class='note sm'>{{dispId}}</span>
      </h3>
      <hr/>
      <a-button @click='ok' type='primary'>确定</a-button>
      <a-button @click='showVarSelect = true'>引用变量</a-button>
      <a-button @click='showFuncSelect = true'>引用函数</a-button>
      
      <pre class='errormsg'>{{codeErrMsg}}</pre>
    </div>
    
    <a-drawer
      title="选择变量"
      placement="right"
      :visible="showVarSelect"
      @close="showVarSelect = false"
    >
      <cl-list-vars @choose='addVar' :allowProps='true' :allowComputed='true'></cl-list-vars>
    </a-drawer>
    
    <a-drawer
      title="选择函数"
      placement="right"
      :visible="showFuncSelect"
      @close="showFuncSelect = false"
    >
      <cl-list-funcs @choose='addFunc'></cl-list-funcs>
    </a-drawer>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['id', 'opt'],
  components : tool.loadc('cl-list-vars', 'cl-list-funcs'),
  
  mounted() {
    this.$emit('blockClose', true);
    this.$emit('change');
  },
  
  computed: {
    dispId() {
      let map;
      let ret = '';
      let root = tool.getRoot();
      let id = this.id;
      
      if (id.startsWith('cp$')) {
        map = root.computeProps;
        ret = '[计算属性]';
      } else if (id.startsWith('v$')) {
        map = root.vars;
        ret = '[变量]';
      } else {
        map = root.argProps;
        ret = '[参数属性]'
      }
      
      if (map && map[id]) {
        ret = map[id].name + ret;
      } else {
        ret = '[未定义]';
      }
      return ret;
    },
  },
  
  data() {
    return {
      codeErrMsg: '',
      errMsg : [],
      showVarSelect : false,
      showFuncSelect : false,
      editor : null,
    };
  },
  
  methods: {
    ok() {
      if (this.checkCode()) {
        this.$emit('blockClose', false);
        this.$emit('close');
      }
      // this.$emit('change');
    },
    
    checkCode() {
      try {
        Function(xv.withFileName(this.opt.code, this.opt.name));
        this.codeErrMsg = null;
        return true;
      } catch(err) {
        this.codeErrMsg = '函数语法错误\n'+ err.message;
        console.error(err);
      }
    },
    
    addVar(id, v) {
      this.insert(tool.refVar(id, v.name));
      this.showVarSelect = false;
    },
    
    addFunc(id, f) {
      this.insert(tool.refFunc(id, f.name, f.params));
      this.showFuncSelect = false;
    },
    
    insert(v) {
      this.editor.insert(v);
    },
    
    setEditor(e) {
      this.editor = e;
    },
  },
}
</script>

<style scoped>
.main {
  display: grid; grid-template-columns: 1fr 300px; gap: 8px;
  height: calc(100vh - 120px);
}
hr {
  border: 0; border-top: 1px dashed #ccc; margin: 25px 0 10px 0;
}
.parmdiv {
  display: grid!important; grid-template-columns: 0 1fr 1fr auto; gap: 2px 0;
}
.errormsg {
  color: red; margin-top: 20px; white-space: pre-wrap;
}
.sm {
  font-size: smaller;
}
.gap {
  margin: 0 8px;
}
</style>