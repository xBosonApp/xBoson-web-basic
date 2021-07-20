<!-- Create By xBoson System -->

<template>
  <a-modal
    title="菜单项编辑"
    :visible="visible"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form-model :model="item" :rules="rules" ref='form'
        :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
      <a-form-model-item label="菜单标题" prop='title'>
        <a-input v-model='item.title' placeholder='中文名'/>  
      </a-form-model-item>
      
      <a-form-model-item label="虚拟路径" prop='path' v-if='! item.isContainer'>
        <a-input v-model='item.path' placeholder='/a/b/c'/>
      </a-form-model-item>
      
      <a-form-model-item label="关联文件" prop='fid' v-if='! item.isContainer'>
        <cl-select-files
          style='width: 100%'
          placeholder="请选择文件"
          v-model='item.fid'
          :dirCanSelect='false'/>
      </a-form-model-item>
      
      <a-form-model-item label='图标'>
        <cl-select-fa-icon v-model='item.icon'/>
      </a-form-model-item>
      
      <a-form-model-item label="可访问角色">
        <cl-select-roles
          v-model='item.roles'/>
        <div class='note'>不填写则不限制访问</div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['visible', 'value'],
  
  components: tool.loadc(
    'cl-select-files', 
    'cl-select-roles', 
    'cl-select-fa-icon'),
  
  data() {
    return {
      item : {},
      
      rules: {
        title : { required: true, message: '必须输入标题' },
        path  : { required: true, message: '必须输入路径' },
        fid   : { required: true, message: '必须选择文件' },
      },
    };
  },
  
  watch: {
    visible(n, o) {
      if (n && o == false) {
        this.item = Object.assign({}, this.value);
      }
    }
  },
  
  methods: {
    onOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('input', Object.assign({}, this.item));
          this.$emit('ok');
          this.onCancel();
          return true;
        }  
        return false;
      });
    },
    
    onCancel() {
      this.$emit('update:visible', false);
    },
  },
}
</script>

<style scoped>
</style>