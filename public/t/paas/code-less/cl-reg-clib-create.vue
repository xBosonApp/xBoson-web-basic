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
    
    <a-form-model-item label='外部依赖项文件'>
      <div v-for='(r, i) in form.requires' class='clibitem'>
        <a-input v-model='form.requires[i]'/>
        <a-button icon='delete' @click='form.requires.splice(i, 1)'/>
        <a-button icon='question' @click='help = true'/>
      </div>
      <cl-add-button icon='add' title='增加依赖文件' @click='form.requires.push("")'/>
    </a-form-model-item>
    
    <a-form-model-item label='分组'>
      <div v-for='(r, i) in form.groups' class='clibitem clibitem2'>
        <a-input v-model='form.groups[i]'/>
        <a-button icon='delete' @click='form.groups.splice(i, 1)'/>
      </div>
      <cl-add-button icon='add' title='增加分组' @click='form.groups.push("")'/>
    </a-form-model-item>
    
    <a-form-model-item :wrapper-col="buttonCol">
      <a-button type='primary' @click='checkForm'>递交</a-button>
      <a-button @click='$emit("change", "default")' style='margin-left: 5px'>返回</a-button>
    </a-form-model-item>
  </a-form-model>
  
  <a-drawer
    title="依赖文件说明"
    placement="top"
    :visible="help"
    height='400'
    @close="help = false"
  >
    <p>
      通常用来加载 vue 组件文件.<br/>
      依赖文件在组件被使用前自动加载, 可以加载 .js 结尾的脚本文件,
    或加载 .css 结尾的样式表文件.
    </p>
    <p>
      依赖文件路径规则:
      <ul>
        <li>以 'cdn/' 开头的路径, 以 cdn 为根目录加载文件</li>
        <li>以 'xui://' 为协议时, 自动添加 '/t' '/ui' 前缀, 并且限定范围在该目录下. </li>
        <li>以 '/' 开头的路径, 在 uifs 范围内寻找文件. </li>
        <li>以 'http://' 或 'https://' 开始的路径加载外部文件 </li>
        <li>以 './' 开头的路径加载低代码平台中的文件 </li>
      </ul>
    </p>
  </a-drawer>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['data', 'next'],
  
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      buttonCol: { span: 14, offset: 4 },
      help: false,
      
      form: {
        name: '',
        isGlobal: true,
        requires: [],
        groups: [],
      },
      
      rules: {
        name: { required: true, message: '名字不能为空', trigger: 'blur' },
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
          let msg = this.checkArray(this.form.requires);
          if (msg) {
            this.next(new Error('依赖文件 '+ msg));
            return false;
          }
          msg = this.checkArray(this.form.groups);
          if (msg) {
            this.next(new Error('分组 '+ msg));
            return false;
          }
          
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
          return '项目不能为空';
        }
        if (f[arr[i]]) {
          return '有重复项' + arr[i];
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
.clibitem { 
  display: grid; grid-template-columns: 1fr auto auto; gap: 2px; margin-top: 2px;
}
.clibitem2 {
  grid-template-columns: 1fr auto;
}
</style>