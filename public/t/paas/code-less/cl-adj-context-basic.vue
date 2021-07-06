<!-- Create By xBoson System -->

<template>
  <div class='row'>
    <a-input-group compact v-for='(s, id) in value'>
      <a-tooltip :title='message[id]' :visible='message[id] != null' placement='left'>
        <a-input v-model='s.name' @change='checkName(id, s)' @blur='setName(id, s)' placeholder='功能性描述'/>
      </a-tooltip>
      <a-button type="primary" icon='edit' @click='openEdit(s, id)'/>
      <a-popconfirm
        title="所有关联的绑定都会被删除"
        ok-text="删除"
        ok-type='danger'
        cancel-text="取消"
        @confirm="remove(id)"
      >
        <a-button type="danger" icon='delete'/>
      </a-popconfirm>
    </a-input-group>
    
    <cl-add-button @click='add' :title='"新建" + pname'></cl-add-button>
    
    <a-drawer
      placement="right"
      :visible="showConfig"
      :width='configWidth'
      @close='closeConfig'
      :closable='!blocked'
      :destroyOnClose='true'
      :maskStyle='maskStyle'
    >
      <template v-slot:title>
        <span class='title'>{{configTitle}}</span>
        <span class='name animate__bounce animate__animated'>{{name}}</span>
        <span class='note sm'>{{hid}}</span>
        <div style='margin-top: 10px; text-align:right;'>
          <slot name='header' :configData='configData'/>
        </div>
      </template>
      <component :is='configComponent' 
        v-bind='configData' 
        @change='onChange' 
        @close='closeConfig' 
        @blockClose='blockClose'/>
    </a-drawer>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: {
    'value' : { required:true, type:Object }, 
    // 名字前缀
    'pname' : { required:true, type:String }, 
     // id 前缀
    'pid'   : { required:true, type:String },
    // 配置页面标题 
    'configTitle' : { required:true, type:String }, 
    // 配置页面组件 'cl-style-adj'
    'configComponent' : { required:true, type:String }, 
    // 配置页面宽度
    'configWidth' : { type:String, default: '300px' }, 
    // 创建新对象函数 Function(opt) name/num属性已经设置
    'initItem' : { required:true, type:Function }, 
    // 创建一个属性对象, 用来初始化 configComponent 组件实例. 
    // Object Function(opt)
    'createConfigData' : { required:true, type:Function },
    // 配置面板遮蔽层样式
    'maskStyle' : { default: {} },
    // 创建按钮点击时被调用, 返回 Promise:Success({id, num 可选}), 默认用全局id生成
    'addHook' : { type:Function },
  },
  
  beforeMount() {
    this.loadComponent();
  },
  
  data() {
    return {
      message     : {},
      showConfig  : false,
      configData  : null,
      name        : '',
      hid         : '',
      showAddTip  : false,
      blocked     : false,
    };
  },
  
  methods: {
    loadComponent() {
      // tool.regc(this.configComponent);
      let name = this.configComponent;
      this.$options.components[name] = tool.requirec(name);
    },
    
    defaultAdd() {
      return new Promise((ok, fail)=>{
        let num = this.nextid();
        let id = this.pid + num;
        ok({id, num});
      });
    },
    
    add() {
      let hook = this.addHook || this.defaultAdd;
      
      hook().then(v=>{
        let num = v.num || this.nextid();
        let opt = {
          name : this.pname + num,
          num,
        };
        this.initItem(opt);
        this.$set(this.value, v.id, opt);
        this.$emit('change');
      }).catch(e=>{
        xv.popError('创建时错误', e);
      });
    },
    
    remove(id) {
      this.$delete(this.value, id);
      this.$emit('change');
    },
    
    openEdit(opt, id) {
      this.configData = this.createConfigData(opt, id);
      this.name = opt.name,
      this.hid = id;
      this.showConfig = true;
    },
    
    conflictName(oid, opt) {
      for (let id in this.value) {
        if (id != oid && this.value[id].name == opt.name) {
          return id;
        }
      }
    },
    
    checkName(id, opt) {
      let cid = this.conflictName(id, opt);
      if (cid) {
        this.$set(this.message, id, '名字重复');
        this.$set(this.message, cid, '名字重复');
      } else {
        this.message = {};
      }
    },
    
    setName(id, opt) {
      if (this.conflictName(id, opt) || (!opt.name)) {
        opt.name = this.pname + opt.num;
      }
      this.message = {};
      this.$emit('change');
    },
    
    nextid() {
      let f = this.$store.state.editFile;
      if (f) {
        return ++f.content.root.id;
      }
      throw new Error("not opend file");
    },
    
    closeConfig() {
      if (this.blocked) return;
      this.showConfig = false;
      this.$emit('close-config', this.configData);
    },
    
    onChange(d) {
      this.$emit('change', d);
    },
    
    blockClose(blocked) {
      this.blocked = blocked;
    },
  },
}
</script>

<style scoped>
.row {
  display: grid; grid-auto-rows: 1fr; row-gap: 2px;
}
.row>button {
  width: 100%;
}
.ant-input-group-compact {
  display: grid!important; grid-template-columns: 0 1fr auto auto;
}
.title {
  font-size: 18px; margin-right: 8px;
}
.sm {
  margin-left: 10px; font-size: 8px;
}
</style>