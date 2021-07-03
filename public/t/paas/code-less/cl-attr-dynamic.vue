<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <div>{{desc}}</div>
    
    <a-switch v-model='isdyn' size="small" @change='onChange' v-if='!isEventBind'>
      <span slot="checkedChildren">动态</span>
      <span slot="unCheckedChildren">固定</span>
    </a-switch>
    
    <component :is='componentName' 
      v-bind='bind' 
      v-model='props[name]' 
      v-if='!isdyn'
      @change='onChange'
      class='full'
    />
    
    <div v-else class='full items-group'>
      <div class='i txt tname note'>{{typeConfig.name}}</div>
      <div class='i txt' v-if='typeVal != null'>
        <div v-if='typeConfig.readonly'>
          {{ typeConfig.disp(typeVal) }}
        </div>
        <div v-else>
          {{ typeVal }}  
        </div>
      </div>
      <div class='i txt nullv' v-else>[空值]</div>
      <a-button class='i' icon='edit' type='primary' @click='openEdit = true'></a-button>
    </div>
    
    <a-drawer
      placement="right"
      width='490px'
      :visible="openEdit"
      :closable='false'
      :destroyOnClose='true'
      @close="openEdit = false">
      
      <template v-slot:title>
        <span class='title'>动态属性配置</span>
        <span class='name animate__bounce animate__animated'>{{desc}}</span>
      </template>
      
      <a-form-item label="属性类型">
        <a-radio-group v-model="config.varType" @change="onChange">
          <a-radio-button v-for='(n, key) in nameMap' :value="key" :key='key' 
            v-if='n.dnotEvent ? (!isEventBind) : true'>
            {{n.name}}
          </a-radio-button>
        </a-radio-group>
        <a-button :key='nullexpr' @click='setNull' style='margin-left: 10px'>
          空
        </a-button>
      </a-form-item>
      
      <a-form-item label='值配置'>
        <a-input-group compact>
          <a-input 
            v-if='typeConfig.readonly'
            :disabled='true' 
            class='typevalue'
            :value='typeConfig.disp(typeVal)'
          />
          <a-input
            v-else
            class='typevalue'
            v-model='typeVal'
          />
          
          <a-button 
            @click='openSelect = true'
            v-if='typeConfig.readonly'
          >
            选择{{ nameMap[config.varType].name }}
          </a-button>
          
          <a-button icon="question"
            @click='showExprHelp = !showExprHelp' v-if='typeConfig.exprHelp'/>
        </a-input-group>
      </a-form-item>
      
      <section v-if='typeConfig.needParams'>
        <div class='g2'>
          <label style='color:black'>实参列表</label>
          <a-button shape="circle" size='small' icon="question" 
            @click='showExprHelp = !showExprHelp' class='fright'/>
        </div>
        
        <div v-if='funcParams != null' class='paramslist'>
          <a-input 
            v-for='(fp, i) in funcParams' 
            :value='getCallParams(i).v' 
            @input='setCallParams($event, i)'
          >
            <template v-slot:addonBefore>
              <span class='cpname'>{{ fp.name }}</span>
            </template>
          </a-input>
        </div>
        <div v-else class='note' style='padding-left: 100px'>
          无参数
        </div>
      </section>
      
      <a-form-item label='修饰符' v-if='isEventBind'>
        <cl-attr-dyn-modifiers
          :modifiers='config.modifiers'/>
      </a-form-item>
      
      <a-form-item>
        <a-button type='primary' @click='ok'>确定</a-button>
      </a-form-item>
      
<pre v-show='showExprHelp'>
<h4>JavaScript 表达式:</h4>
  数字: <code>0</code> <code>99.9</code>
  字符串(必须有单引号): <code>'abc'</code>
  上下文变量引用: <code>i</code> <code>v[i].name</code>
  函数调用: <code>fn()</code> <code>fn(1, "abc")</code>
  函数引用: <code>fn</code>
  计算: <code>a+b+1 &gt; 0</code>
  更多 js 语法可参考 <a :href='wikiurl' target='_blank'>wiki</a>.
  
  <a-button @click='showExprHelp = false' size='small'>关闭</a-button>
</pre>
      
      <a-drawer
        title='选择'
        placement="right"
        :visible="openSelect"
        :closable='true'
        :destroyOnClose='true'
        @close="openSelect = false"
      >
        <component 
          :is='typeConfig.component'
          @choose='typeConfig.choose'/>
      </a-drawer>
    </a-drawer>
  </div>
</template>

<script>
const tool = require("./tool.js");
const clib = require("./component-library.js");
const role = require("./component-role.js");

export default {
  props: ['name', 'desc', 'componentName', 'bind', 'props', 'propsConfig', 'isEventBind', 'cid'],
  
  components: tool.loadc('cl-list-vars', 'cl-list-funcs', 'cl-attr-dyn-modifiers'),
  
  computed: {
    typeConfig() {
      return this.nameMap[this.config.varType];
    },
    
    typeVal: {
      get() {
        switch (this.config.varType) {
          case 'expr': 
            return this.config.expr;
          case 'constant':
            return this.props[this.name];
          default:
            return this.config.ref;
        }
      },
      set(v) {
        switch (this.config.varType) {
          case 'expr': 
            return this.config.expr = v;
          case 'constant':
            return this.props[this.name] = v;
          default:
            return this.config.ref = v;
        }
      }
    },
    
    funcParams() {
      let f = tool.getRoot().funcs[this.config.ref];
      if (f) {
        return f.params;
      }
    },
    
    config() {
      if (!this.propsConfig[this.name]) {
        let comp = clib.getComponent(this.cid);
        if (comp) {
          let pc = role.createPropsConfig(this.name, comp);
          this.$set(this.propsConfig, this.name, pc);
          this.$set(this.props, this.name, null);
        } else {
          throw new Error("component not exits, id:"+ this.cid);
        }
      }
      return this.propsConfig[this.name];
    },
    
    isdyn: {
      get() {
        if (this.isEventBind) return true;
        return this.config.varType != 'constant';
      },
      set(v) {
        if (this.isEventBind) return;
        if (!v) {
          this.config.varType = 'constant';
        } else {
          this.config.varType = 'expr';
        }
      },
    },
  },
  
  data() {
    return {
      wikiurl : xv.ctx_prefix + "/face/web/wiki-api/index.html#docs/javascript-doc.htm",
      showExprHelp : false,
      openEdit : false,
      openSelect : false,
      root : tool.getRoot(),
      nameMap : {
        'constant'  : { name : '常量', 
            hide      : true,
            dnotEvent : true },
        'variable'  : { name : '变量', 
            readonly  : true, 
            component : 'cl-list-vars', 
            choose    : this.selectRef,
            disp      : this.dispVar,
            dnotEvent : true},
        'function'  : { name : '函数引用', 
            readonly  : true, 
            component : 'cl-list-funcs',
            choose    : this.selectRef,
            disp      : this.dispFunc},
        'call'      : { name : '函数调用', 
            readonly  : true, 
            needParams: true, 
            component : 'cl-list-funcs',
            choose    : this.selectCall,
            disp      : this.dispFunc },
        'expr'      : { name : '表达式', 
            exprHelp  : true },
      },
    };
  },
  
  methods: {
    onChange() {
      this.$emit('change');
    },
    
    ok() {
      this.openEdit = false;
      this.onChange();
    },
    
    selectRef(id, cfg) {
      // console.log('ref', id, cfg);
      this.openSelect = false;
      this.typeVal = id;
    },
    
    selectCall(id, cfg) {
      // console.log('call', id, cfg);
      this.openSelect = false;
      this.typeVal = id;
      
      if (!this.config.callParams) {
        this.$set(this.config, 'callParams', []);
      }
    },
    
    dispFunc(id) {
      let f = this.root.funcs[id];
      if (f) {
        return f.name;
      }
      this.config.ref = null;
      return null;
    },
    
    dispVar(id) {
      let v = this.root.vars[id];
      if (v) {
        return v.name;
      }
      this.config.ref = null;
      return null;
    },
    
    setCallParams(e, i) {
      this.config.callParams[i].v = e.target.value;
    },
    
    getCallParams(i) {
      if (!this.config.callParams[i]) {
        this.$set(this.config.callParams, i, {t:0, v:null, n:null});
      }
      return this.config.callParams[i];
    },
    
    setNull() {
      this.config.varType = 'expr';
      this.config.expr = null;
    },
  },
}
</script>

<style scoped>
.main, .g2 {
  display: grid; grid-template-columns: 1fr auto;
}
.full {
  grid-column: 1/3;
}
.txt {
  padding: 5px 0 0 9px; border-color: #ccc;
}
.nullv {
  background-color: #ffe6e6; text-align: center;
}
.typevalue {
  width: 70%!important;
}
.title {
  margin-right: 8px;
}
.tname {
  word-break: keep-all;
}
.cpname {
  min-width: 100px; display: block;
}
.paramslist>* {
  margin-top: 3px;
}
h4 {
  border-bottom: 1px dashed #eee;
}
section {
  margin-bottom: 24px;
}
</style>