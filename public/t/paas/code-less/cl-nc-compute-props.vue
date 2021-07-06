<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <x-ace v-model='opt.gcode' 
      language='javascript' 
      @editHandle='setGetterEditor'
      v-show='isGetterMode'/>
    
    <x-ace v-model='opt.scode' 
      language='javascript' 
      @editHandle='setSetterEditor'
      v-show='! isGetterMode'/>
    
    <div>
      <a-form-item label='代码切换'>
        <a-switch v-model='isGetterMode'>
          <div slot="checkedChildren"><a-icon type="export"/> <span>显示获取(Getter)属性代码</span></div>
          <div slot="unCheckedChildren"><a-icon type="download"/> <span>显示设置(Setter)属性代码</span></div>
        </a-switch>
      </a-form-item>
      
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
  
  data() {
    return {
      codeErrMsg: '',
      checkVar : /^[_a-zA-z$].?/,
      errMsg : [],
      showVarSelect : false,
      showFuncSelect : false,
      g_editor : null,
      s_editor : null,
      isGetterMode : true,
    };
  },
  
  computed: {
    editor() {
      return this.isGetterMode ?this.g_editor :s_editor;
    },
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
      if (!this._checkCode(this.opt.gcode)) {
        this.isGetterMode = true;
        return;
      }
      if (!this._checkCode(this.opt.scode)) {
        this.isGetterMode = false;
        return;
      }
      return true;
    },
    
    _checkCode(code) {
      try {
        Function(xv.withFileName(code, this.opt.name));
        this.codeErrMsg = null;
        return true;
      } catch(err) {
        this.codeErrMsg = (this.isGetterMode ?'获取' :'设置') +'函数语法错误\n'+ err.message;
        console.error(err);
      }
    },
    
    addVar(id, v) {
      this.editor.insert(tool.refVar(id, v.name));
      this.showVarSelect = false;
    },
    
    addFunc(id, f) {
      this.editor.insert(tool.refFunc(id, f.name, f.params));
      this.showFuncSelect = false;
    },
    
    setGetterEditor(e) {
      this.g_editor = e;
    },
    
    setSetterEditor(e) {
      this.s_editor = e;
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
</style>