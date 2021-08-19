<!-- Create By xBoson System -->

<template>
<div class='items-group m'>
  <div class='content'>
    <h3>属性列表</h3>
    <div class='note'>{{ data.clib.name }} &gt; {{ bname }}</div>
    
    <div class='list'>
      <div v-for="(p, n) in prop" class='items-group p'>
        <a-button @click='onOpen(p, n)'>{{ n }}</a-button>
        <a-popconfirm placement="right" title='删除选中的属性?'
            ok-text="删除" cancel-text="取消" @confirm="onDelete(p, n)">
          <a-button icon='delete'/>
        </a-popconfirm>
      </div>
    </div>
  </div>
  
  <div v-if='! showEditForm' class='content'>
    <a-tooltip title='新建属性'>
      <a-button icon='plus' @click='onCreate'/>
    </a-tooltip>
    
    <a-button @click='doCopy' icon='copy' />
    <a-button @click='openPaste' icon='highlight' :disabled='cannotPaste' />
    
    <a-button icon='home' @click='$emit("change", "default")'/>
    <a-button icon='rollback' @click='$emit("previous")'/>
  </div>
  
  <div v-else class='content'>
    <a-form-model ref='ruleForm' :model="form" :label-col="labelCol"
      :wrapper-col="wrapperCol" :rules="rules">
      
      <a-form-model-item label='属性描述' prop='desc'>
        <a-input v-model='form.desc' placeholder='配置该属性时的描述文字'/>
      </a-form-model-item>
      
      <a-form-model-item label="属性名" prop="name">
        <a-input v-model="form.name" placeholder='必须是英文字母或数字'/>
      </a-form-model-item>
      
      <a-form-model-item label='属性用途' prop='pctype'>
        <a-select v-model='form.pctype' :options='pctypeList'/>
      </a-form-model-item>
      
      <a-form-model-item label='值类型' prop='type'>
        <a-select v-model='form.type' :options='typeList'/>
      </a-form-model-item>
      
      <a-form-model-item label="默认值">
        <a-input v-model="form.def" placeholder='根据值类型的不同设置正确的默认值'/>
      </a-form-model-item>
      
      <a-form-model-item label='可以为动态属性' v-if='form.type != 7'>
        <a-switch checked-children="动态属性" un-checked-children="总是常量" v-model='form.canDynamic'/>
      </a-form-model-item>
      
      <a-form-model-item label='常量值类型解析方式' v-if='form.type != 7 && !form.canDynamic'>
        <a-switch checked-children="表达式方式" un-checked-children="总是字符串" v-model='form.isExprAttr'/>
      </a-form-model-item>
      
      <a-form-model-item label="自定义插件" prop="component" v-if='showDefineComponent'>
        <a-input v-model="form.component" placeholder='VUE 组件, 用于属性配置'/>
      </a-form-model-item>
      
      <a-form-model-item label="自定义插件参数" prop="component" v-if='showDefineComponent'>
        <cl-array-input title='添加选项' 
          v-model='form.cprops'
          keyPlaceholder='有效的变量名格式: 数字/字母/字符 _$'
          varPlaceholder='这是表达式, 字符串值需要用引号包围'
          keyLabel='参数名'
          varLabel='参数值'
          :verify='evalVar'
          :varInputTransfer='toInput'
        />
      </a-form-model-item>
      
      <a-form-model-item label='多选项列表' v-if='showSelect' prop='select'>
        <cl-array-input title='添加选项' 
          v-model='form.select'
          keyPlaceholder='用于显示, 中文字符'
          varPlaceholder='这是表达式, 字符串值需要用引号包围'
          keyLabel='选项名'
          varLabel='选项值'
          :verify='evalVar'
          :varInputTransfer='toInput'
        />
      </a-form-model-item>
      
      <a-form-model-item :wrapper-col="buttonCol" class='cl-buttons'>
        <a-button type='primary' @click='onSubmit'>递交</a-button>
        <a-button @click='showEditForm = false'>取消</a-button>
      </a-form-model-item>
      
    </a-form-model>
  </div>
  
  <a-modal
    title="粘贴选项"
    :visible="propsClipboard != null"
    :confirm-loading="confirmPropsClipboardLoading"
    @ok="doPaste"
    @cancel="cancelClipboard"
  >
    <h3>选择要粘贴的项目</h3>
    <div v-for='(p, n) in propsClipboard'>
      <a-checkbox :name='n' v-model='propsClipboardSelect[n]' class='pp'>
        <b v-if='prop[n]' style='color: red'>覆盖</b>
        <b v-else style='color: blue'>新建</b>
        <span>{{ n }}</span>
        <b> - </b>
        <span>{{ p.desc }}</span>
      </a-checkbox>
    </div>
  </a-modal>
</div>
</template>

<script>
const tool = require("./tool.js");
const crole = require("./component-role.js");

export default {
  props: ['next', 'data'],
  components: tool.loadc('cl-array-input'),
  
  mounted() {
    if (this.data.bind) {
      this.prop = this.data.bind.props || {};
      this.bname = this.data.bind.txt;
      // console.log(this.data.bind)
    } else {
      this.getProps();
    }
  },
  
  data() {
    let checkSelect = (rule, value, cb)=>{
      if (Object.keys(value).length > 0) {
        cb();
      } else {
        cb('选项列表至少需要一个有效选项');
      }
    };
    
    return {
      prop : {},
      bname : '',
      showEditForm: false,
      mode : null,
      
      form: this.defaultForm(),
      propsClipboard: null,
      propsClipboardSelect: null,
      confirmPropsClipboardLoading: false,
      
      rules: {
        name: { required: true, message: '属性名字不能为空', trigger: 'blur' },
        desc: { required: true, message: '描述不能为空', trigger: 'blur' },
        type: { required: true, message: '必须选择一个类型', trigger: 'blur' },
        component: { required: true, message: '必须为属性设置一个配置组件', trigger: 'blur' },
        pctype: { required: true, message: '必须选择一个用途', trigger: 'blur' },
        select: { required: true, validator: checkSelect }
      },
      
      pctypeList: crole.propTypeSelectOptions(),
      typeList : crole.propSelectOptions(),
      
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      buttonCol: { span: 14, offset: 4 },
    };
  },
  
  computed: {
    showSelect() {
      return this.form.type == 3 || this.form.type == 10;
    },
    
    showDefineComponent() {
      return this.form.type == 7;
    },
    
    cannotPaste() {
      return (this.$store.state.propsClipboard == null) 
        || (this.$store.state.propsClipboard == this.prop)
        || (this.prop == null);
    },
  },
  
  methods: {
    getProps() {
      let p = this.parmHead();
      tool.api('register', 'list_c_bind', p, (err, ret)=>{
        if (err) return this.next(err);
        this.prop = ret.data[0].props;
        this.bname = ret.data[0].txt;
      });
    },
    
    defaultForm() {
      return {
        desc      : '',
        name      : '',
        type      : 1,
        select    : {},
        def       : null,
        canDynamic: false,
        component : null,
        cprops    : {},
        pctype    : 'attribute',
        isExprAttr: null,
      };
    },
    
    onOpen(p, n) {
      this.mode = 'edit';
      this.showEditForm = true;
      this.copyToForm(p, n);
    },
    
    copyToForm(p, name) {
      this.form = {
        name,
        desc      : p.desc,
        type      : p.type,
        select    : p.select,
        def       : p.def || '',
        canDynamic: p.canDynamic,
        component : p.component,
        cprops    : p.props,
        pctype    : p.propsConfig.type,
        isExprAttr: p.propsConfig.isExprAttr,
      };
    },
    
    evalVar(o) {
      try {
        o.v = Function('return ('+ o.v +')')();
        return Promise.resolve();
      } catch(err) {
        throw new Error("无效的表达式 "+ err.message);
      }
    },
    
    toInput(v) {
      if (typeof v == 'string' || typeof v == 'object') {
        return JSON.stringify(v);
      }
      return v;
    },
    
    onDelete(p, n) {
      this.showEditForm = false;
      let parm = this.parmHead();
      parm.name = n;
      
      tool.api('register', 'del_c_prop', parm, (err, ret)=>{
        if (err) return this.next(err);
        antd.message.success("属性已删除");
        this.showEditForm = false;
        this.$emit('clear');
        this.$delete(this.prop, n);
      });
    },
    
    onCreate() {
      this.form = this.defaultForm();
      this.showEditForm = true;
      this.mode = 'create';
    },
    
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return false;
        }
        
        this.callEditApi().catch(this.next).then(this.getProps);
      });
    },
    
    callEditApi() {
      return new Promise((ok, fail)=>{
        let p = this.getApiParm();
        tool.api('register', 'set_c_prop', p, (err, ret)=>{
          if (err) return fail(err);
          
          antd.message.success(p.name +" 属性已设置");
          this.showEditForm = false;
          this.$emit('clear');
          ok(ret);
        });
      });
    },
    
    parmHead() {
      this.$store.commit('theComponentChanged', this.data.clib._id);
      return {
        clid : this.data.clib._id,
        _id  : this.data.bind._id,
      };
    },
    
    getApiParm() {
      let parm = this.parmHead();
      for (let n in this.form) {
        parm[n] = this.form[n];
      }
      ['select', 'cprops'].forEach(n=>{
        parm[n] = JSON.stringify(parm[n]);
      });
      return parm;
    },
    
    doCopy() {
      this.$store.commit('setComponentPropsClipboard', this.prop);
      this.$message.info("已复制");
    },
    
    openPaste() {
      this.confirmPropsClipboardLoading = false;
      this.propsClipboard = this.$store.state.propsClipboard;
      this.propsClipboardSelect = {};
    },
    
    cancelClipboard() {
      this.confirmPropsClipboardLoading = false;
      this.propsClipboard = this.propsClipboardSelect = null;
    },
    
    async doPaste() {
      this.confirmPropsClipboardLoading = true;
      
      for (let n in this.propsClipboardSelect) {
        if (!this.propsClipboardSelect[n]) continue;
        let p = this.propsClipboard[n];
        this.copyToForm(p, n);
        await this.callEditApi();
      }
      
      this.getProps();
      this.cancelClipboard();
    },
  },
}
</script>

<style scoped>
.m { grid-template-columns: 1fr 2fr; }
.p { grid-template-columns: 1fr auto; }
.content { min-height: 300px; }
.pp span { min-width: 100px; display: inline-block; };
</style>