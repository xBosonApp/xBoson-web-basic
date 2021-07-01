<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <div>{{desc}}</div>
    
    <a-switch v-model='isdyn' size="small" @change='onChange'>
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
      width='450px'
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
          <a-radio-button v-for='(n, key) in nameMap' :value="key" :key='key'>
            {{n.name}}
          </a-radio-button>
        </a-radio-group>
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
        </a-input-group>
      </a-form-item>
      
      <a-form-item label='实参列表' v-if='typeConfig.needParams'>
        <a-input v-for='(cp, i) in config.callParams' v-model='cp.v'>
          <template v-slot:addonBefore>
            <span class='cpname'>{{ cp.n }}</span>
          </template>
        </a-input>
      </a-form-item>
      
      <a-button type='primary' @click='ok'>确定</a-button>
      
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

export default {
  props: ['name', 'desc', 'componentName', 'bind', 'props', 'propsConfig'],
  
  components: tool.loadc('cl-list-vars', 'cl-list-funcs'),
  
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
    
    config() {
      return this.propsConfig[this.name];
    },
    
    isdyn: {
      get() {
        return this.config.varType != 'constant';
      },
      set(v) {
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
      openEdit : false,
      openSelect : false,
      root : tool.getRoot(),
      nameMap : {
        'constant'  : { name : '常量', hide:true },
        'variable'  : { name : '变量', 
            readonly  : true, 
            component : 'cl-list-vars', 
            choose    : this.selectRef,
            disp      : this.dispVar },
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
        'expr'      : { name : '表达式' },
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
      } else {
        this.config.callParams.splice(0);
      }
        
      cfg.params.forEach(p=>{
        this.config.callParams.push({
          t: 0, v: null, n: p.name,
        });  
      });
    },
    
    dispFunc(id) {
      let f = this.root.funcs[id];
      if (f) {
        return f.name;
      }
      //TODO: 这里逻辑不通
      if (this.config.callParams && this.config.callParams.length) {
        this.config.callParams.splice(0);
        console.log('1');
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
  },
}
</script>

<style scoped>
.main {
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
</style>