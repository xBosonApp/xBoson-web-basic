<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <x-ace v-model='opt.code' language='javascript' @insertHandle='setInsertHandle'></x-ace>
    <div>
      <h4>函数参数</h4>
      <div class='parmdiv note'>
        <span></span>
        <span>描述名</span>
        <span>形参名</span>
        <span></span>
      </div>
      
      <a-input-group compact v-for='(p, i) in opt.params' class='parmdiv'>
        <a-tooltip placement="left" :title='errMsg[i]' :visible='errMsg[i] != null'>
          <a-input v-model='p.name' @change='onChange'/>
        </a-tooltip>
        <a-input v-model='p.pn' @change='onChange'/>
        <a-popconfirm
          title="删除形参?"
          ok-text="删除"
          okType='danger'
          cancel-text="取消"
          @confirm="removep(i)">
          <a-button icon='delete' type='danger'/>
        </a-popconfirm>
      </a-input-group compact>
      
      <cl-add-button @click='addp' title='添加函数参数'/>
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
      <cl-list-vars @choose='addVar'></cl-list-vars>
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
      upComments : tool.delayWorker(this.rewriteComments, 500),
      insertHandle : null,
    };
  },
  
  methods: {
    removep(i) {
      this.opt.params.splice(i, 1);
      this.rewriteComments();
    },
    
    ok() {
      if (this.checkNameRule() && this.checkCode()) {
        this.$emit('blockClose', false);
        this.$emit('close');
      }
      // this.$emit('change');
    },
    
    checkNameRule() {
      for (let i=0; i<this.opt.params.length; ++i) {
        let p = this.opt.params[i];
        if (!p.name) {
          this.$set(this.errMsg, i, '描述无效');
          return false;
        }
        else if (!this.checkVar.test(p.pn)) {
          this.$set(this.errMsg, i, '形参名无效');
          return false;
        }
        else {
          this.$set(this.errMsg, i, null);
        }
      }
      return true;
    },
    
    checkCode() {
      try {
        new Function(this.opt.code);
        this.codeErrMsg = null;
        return true;
      } catch(err) {
        // TODO: 这种方法不能解析行列
        // let errInf = /(.*Error:.*)[\S\s]+:([0-9]+):([0-9]+)/.exec(err.stack);
        // if (errInf) {
        //   console.log(err, errInf)
        //   let msg = errInf[1];
        //   let row = errInf[2];
        //   let col = errInf[3];
        //   this.codeErrMsg = ['函数语法错误\n', msg, '\n在第', row, '行, 第', col, '列' ].join('');
        // } else {
        //   this.codeErrMsg = err.stack;
        // }
        this.codeErrMsg = '函数语法错误\n'+ err.message;
        console.error(err);
      }
    },
    
    addp() {
      let i = this.opt.params.length;
      this.opt.params.push({
        name : '参数'+ i,
        pn   : 'v'+ i,
      });
      this.rewriteComments();
    },
    
    onChange() {
      this.upComments();
    },
    
    addVar(id, v) {
      let n = ['this.', id, ' /* ', v.name, ' */'];
      this.insertHandle(n.join(''));
      this.showVarSelect = false;
    },
    
    addFunc(id, f) {
      let len = f.params.length;
      let n = ['this.', id, '('];
      if (len) {
        for (let i=0; i<len; ++i) {
          n.push('null', ', ');
        }
        n.pop();
      }
      n.push(') /* ', f.name);
      
      if (len) {
        n.push('(');
        f.params.forEach(p=>{
          n.push(p.name, ', ');
        });
        n.pop();
        n.push(')');
      }
      n.push(' */');
      this.insertHandle(n.join(''));
      this.showFuncSelect = false;
    },
    
    rewriteComments() {
      if (this.checkNameRule()) {
        let c = tool.generateFunctionComments(this.opt);
        let p = /\/\/ XAutoG:::\[[\S\s]*\]:::/;
        
        if (p.test(this.opt.code)) {
          this.opt.code = this.opt.code.replace(p, c);
        } else {
          this.opt.code = c +'\n\n'+ this.opt.code;
        }
      }
      // this.$emit('change');
    },
    
    setInsertHandle(h) {
      this.insertHandle = h;
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