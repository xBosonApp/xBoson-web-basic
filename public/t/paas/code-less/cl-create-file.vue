<!-- Create By xBoson System -->

<template>
  <div>
    <a-form-model :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }"
      :rules="rules" ref='createForm' showIcon='true'>
      
      <a-form-model-item label="文件名" prop='name'>
        <a-input v-model="form.name" />
      </a-form-model-item>
      
      <a-form-model-item label="保存目录" prop='parentid'>
        <cl-file-selector
          placeholder="请选择目录"
          v-model="form.parentid"
          :fileCanSelect='false'
        />
      </a-form-model-item>
      
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onCreate">
          确定
        </a-button>
        <a-button style="margin-left: 10px;" @click='quit'>
          关闭
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  components: tool.loadc('cl-file-selector'),
  
  data() {
    return {
      form:{
        name:'',
        parentid:'',
      },
      
      rules : {
        name : [
          { required: true, message: '请输入有效文件名' }
        ],
        parentid: [
          { required: true, message: '必须选择目录 (不能是根目录, 请在"文件管理"中创建目录)' }
        ],
      },
    };
  },
  
  methods: {
    quit() {
      this.$emit('close');
    },
    
    error(err) {
      xv.popError('错误', err);
    },
    
    onCreate() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          tool.api('file', 'mkfile', this.form, (err, ret)=>{
            if (err) {
              this.error(err);
            } else {
              this.$emit('open-file', ret.file_id);
              this.quit();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
}
</script>

<style>
</style>