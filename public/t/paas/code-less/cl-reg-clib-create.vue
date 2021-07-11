<!-- Create By xBoson System -->

<template>
<div>
  <a-form-model ref='ruleForm' :model="form" :label-col="labelCol" 
    :wrapper-col="wrapperCol" :rules="rules">
    
    <a-form-model-item label="组件库名字" prop="name">
      <a-input v-model="form.name" />
    </a-form-model-item>
    
    <a-form-model-item label='是否全局共享'>
      <a-switch checked-children="全局共享" 
        un-checked-children="只在当前项目中使用" 
        v-model='form.isGlobal' />
    </a-form-model-item>
    
    <div class='items-group gi'>
      <div class='ant-form-item-label'>
        <label>分组</label>  
      </div>
      
      <a-form-model-item 
          prop='groups' 
          style='padding-right: 20px'
          :labelCol='{ span: 0 }' 
          :wrapperCol='{ span: 24 }'>
        
        <div v-for='(r, i) in form.groups' class='clibitem clibitem2'>
          <a-input v-model='form.groups[i]' placeholder='分组名'/>
          <a-button icon='delete' @click='form.groups.splice(i, 1)'/>
        </div>
        <cl-add-button icon='add' title='增加分组' @click='form.groups.push("")'/>
      </a-form-model-item>
      
      <a-form-model-item 
          label='外部依赖项文件' 
          prop='requires'
          :labelCol='{ span: 6 }' 
          :wrapperCol='{ span: 18 }'>
        
        <div v-for='(r, i) in form.requires' class='clibitem'>
          <a-input v-model='form.requires[i]' @input='pathChanged[i] = 1' placeholder='文件路径'/>
          <a-button icon='delete' @click='form.requires.splice(i, 1)'/>
          <a-button icon='question' @click='help = true'/>
        </div>
        <cl-add-button icon='add' title='增加依赖文件' @click='form.requires.push("")'/>
      </a-form-model-item>
    </div>
  
    <a-form-model-item :wrapper-col="buttonCol">
      <a-button type='primary' @click='checkForm'>递交</a-button>
      <a-button @click='$emit("change", "default")' style='margin-left: 5px'>返回</a-button>
    </a-form-model-item>
  </a-form-model>
  
  <cl-path-rule title='依赖文件说明' v-model='help'>
    通常用来加载 vue 组件库文件.<br/>
    依赖文件在组件被使用前自动加载, 可以加载 .js 结尾的脚本文件,
    或加载 .css 结尾的样式表文件.
  </cl-path-rule>
  
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['data', 'next'],
  components: tool.loadc('cl-path-rule'),
  
  data() {
    let checkreq = (rule, value, cb)=>{
      let i = -1;
      let _next = ()=>{
        if (++i < value.length) {
          if (this.pathChanged[i]) {
            let _i = i;
            tool.uiFileExists(value[i]).catch(cb).then(_next).then(()=>{
              this.pathChanged[_i] = 0;  
            });
          } else {
            _next();
          }
        } else {
          cb();
        } 
      };
      
      let err = this.checkArray(value);
      if (err) {
        cb(err);
      } else {
        _next();
      }
    };
    
    let checkgrp = (rule, val, cb)=>{
      cb(this.checkArray(val));
    };
    
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      buttonCol: { span: 14, offset: 4 },
      help: false,
      pathChanged: [],
      
      form: {
        name: '',
        isGlobal: true,
        requires: [],
        groups: [],
      },
      
      rules: {
        name: { required: true, message: '名字不能为空', trigger: 'blur' },
        requires: { validator: checkreq, trigger: 'blur'},
        groups: { validator: checkgrp, trigger: 'blur'},
      },
    };
  },
  
  mounted() {
    if (this.data.isModify) {
      this.form = this.data.clib;
    }
  },
  
  methods: {
    checkForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.data.isModify) {
            this.submitEdit();
          } else {
            this.submitCreate();
          }
        } else {
          return false;
        }
      });
    },
    
    checkArray(arr) {
      let f = {};
      for (let i=0; i<arr.length; ++i) {
        if (!arr[i]) {
          return new Error('项目不能为空');
        }
        if (f[arr[i]]) {
          return new Error('有重复项' + arr[i]);
        }
        f[arr[i]] = 1;
      }
    },
    
    submitCreate() {
      tool.api('register', 'create_component_lib', this.form, this.next);
    },
    
    submitEdit() {
      tool.api('register', 'edit_c_lib', this.form, this.next);
    },
  },
}
</script>

<style scoped>
.clibitem, .g2 { display: grid; grid-template-columns: 1fr auto auto; gap: 2px; margin-top: 2px; }
.clibitem2 { grid-template-columns: 1fr auto; }
.g2 { grid-template-columns: 1fr 1fr; }
.gi { grid-template-columns: 4fr 6fr 8fr 6fr; }
</style>