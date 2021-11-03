<!-- Create By xBoson System -->

<template>
<div>
  <a-form-model ref='ruleForm' :model="form" :label-col="labelCol"
    :wrapper-col="wrapperCol" :rules="rules">
    
    <a-form-model-item label="组件名" prop="txt">
      <a-input v-model="form.txt" placeholder='在组件库中的显示名称, 渲染时的默认文字'/>
    </a-form-model-item>
    
    <a-form-model-item label="帮助文档">
      <a-textarea v-model="form.doc" placeholder='帮助文档会保留格式, 同时支持 Html 标签'/>
    </a-form-model-item>
    
    <a-form-model-item label="是否渲染组件名">
      <a-switch checked-children="不渲染" 
        un-checked-children="渲染" 
        v-model='form.removeTxt' />
    </a-form-model-item>
    
    <a-form-model-item label='分组' prop='groupName'>
      <a-select v-model='form.groupName'>
        <a-select-option :value="g" v-for='g in data.clib.groups'>
          {{ g }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    
    <a-form-model-item label="渲染标签" prop='component'>
      <a-input v-model='form.component' placeholder='最终渲染的 VUE 组件或 Html 标签'/>
    </a-form-model-item>
    
    <a-form-model-item label="是否容器">
      <a-switch checked-children="容器组件" 
        un-checked-children="普通组件" 
        v-model='form.isContainer' />
    </a-form-model-item>
    
    <a-form-model-item label="编辑器辅助标签">
      <a-input v-model='form.helpTag' 
        placeholder='设计时替代渲染标签, 辅助编辑器的页面开发'/>
    </a-form-model-item>
    
    <a-form-model-item label="组件加载器 (插件)">
      <cl-array-input title='添加插件' 
        v-model='form.plugins'
        varPlaceholder='完整的文件路径, 以 .vue 结尾的文件扩展名'
        keyLabel='Vue 插件名'
        varLabel='加载路径'
        :verify='verifyPath'
      >
        <a-button slot='valueAddtion' icon='question' @click='showPathHelp = true'/>
      </cl-array-input>
    </a-form-model-item>
    
    <a-form-model-item :wrapper-col="buttonCol" class='cl-buttons'>
      <a-button type='primary' @click='checkForm'>下一步</a-button>
      <a-button @click='showStyleEditor = true'>设置默认样式</a-button>
      <a-button @click='$emit("previous")'>返回</a-button>
    </a-form-model-item>
    
  </a-form-model>
  
  <a-drawer
    title="组件默认样式"
    placement="right"
    :visible="showStyleEditor"
    width='400'
    @close="showStyleEditor = false"
  >
    <cl-style-adj :styleVal='form.style'/>
  </a-drawer>
  
  <cl-path-rule title='插件加载路径' v-model='showPathHelp'>
    完整的文件路径, 以 .vue 结尾的文件扩展名. 
    插件用于加载编辑器辅助标签, 和属性编辑辅助标签.
    插件在设计时被加载到全局, 为了防止冲突, 插件名应该设置前缀.
  </cl-path-rule>
    
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['next', 'data'],
  
  components: tool.loadc('cl-style-adj', 'cl-path-rule', 'cl-array-input'),
  
  mounted() {
    if (this.data.isModifyBind) {
      this.form = this.data.bind;
    }
  },
  
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      buttonCol: { span: 14, offset: 4 },
      showStyleEditor: false,
      showPathHelp: false,
      
      form : {
        txt: '',
        doc: '',
        removeTxt: false,
        component: '',
        helpTag: '',
        style: {},
        plugins: {},
        groupName: '',
        isContainer: false,
      },
      
      rules: {
        txt: { required: true, message: '名字不能为空', trigger: 'blur' },
        component: { required: true, message: '组件不能为空', trigger: 'blur' },
        groupName: { required: true, message: '必须选择一个分组', trigger: 'blur' },
      },
    };
  },
  
  methods: {
    checkForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.data.isModifyBind) {
            this.submitEdit();
          } else {
            this.submitCreate();
          }
        } else {
          return false;
        }
      });
    },
    
    getApiParm() {
      let parm = {
        clid : this.data.clib._id,
      };
      for (let n in this.form) {
        parm[n] = this.form[n];
      }
      ['style', 'plugins'].forEach(n=>{
        parm[n] = JSON.stringify(parm[n]);
      });
      return parm;
    },
    
    submitCreate() {
      tool.api('register', 'bind_component', this.getApiParm(), (err, ret)=>{
        if (err) return this.next(err);
        ret.txt = this.form.txt;
        this.next(null, ret, {bind:ret});
      });
    },
    
    submitEdit() {
      tool.api('register', 'bind_edit', this.getApiParm(), (err, ret)=>{
        if (err) return this.next(err);
        this.next(null, ret, {ret});
      });
    },

    verifyPath(obj) {
      let path = obj.v;
      if (! path.endsWith('.vue')) {
        throw new Error("不是 .vue 组件文件");
      }
      return tool.uiFileExists(path);
    },
  },
}
</script>

<style scoped>
.p { border-bottom: 1px solid #eee; line-height: 23px; }
.plugins {
  grid-template-columns: 1fr auto 2fr auto; gap: 2px 0;
}
.ppath { grid-template-columns: 1fr auto; }
</style>