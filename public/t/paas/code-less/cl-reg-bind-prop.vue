<!-- Create By xBoson System -->

<template>
<div class='items-group m'>
  <div class='content'>
    <h3>属性列表</h3>
    <div class='list'>
      <div v-for="(p, n) in prop" class='items-group p'>
        <a-button>{{ n }} - {{ p.desc }}</a-button>
        <a-button icon='delete'/>
      </div>
    </div>
  </div>
  
  <div v-if='! showEditForm' class='content'>
    <a-tooltip title='新建属性'>
      <a-button icon='plus'/>
    </a-tooltip>
    <a-tooltip title='删除属性'>
      <a-button icon='delete'/>
    </a-tooltip>
    <a-button icon='rollback' @click='$emit("previous")'/>
  </div>
  
  <div v-else class='content'>
    <a-form-model ref='ruleForm' :model="form" :label-col="labelCol"
      :wrapper-col="wrapperCol" :rules="rules">
      
    </a-form-model>
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['next', 'data'],
  
  mounted() {
    if (this.data.bind) {
      this.prop = this.data.bind.props;
    } else {
      this.getProps();
    }
  },
  
  data() {
    return {
      prop : {},
      showEditForm: false,
      
      form: {
        name      : '',
        desc      : '',
        type      : 0,
        select    : [],
        def       : null,
        canDynamic: false,
        component : null,
        pctype    : null,
        isExprAttr: null,
        cprops    : {},
      },
      
      rules: {
        name: { required: true, message: '属性名字不能为空', trigger: 'blur' },
        desc: { required: true, message: '描述不能为空', trigger: 'blur' },
      },
      
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      buttonCol: { span: 14, offset: 4 },
    };
  },
  
  methods: {
    getProps() {
      let p = {
        _id  : this.data.ret._id,
        clid : this.data.clib._id,
      };
      tool.api('register', 'list_c_bind', p, (err, ret)=>{
        if (err) return this.next(err);
        this.prop = ret.data[0].props;
      });
    },
  },
}
</script>

<style scoped>
.m { grid-template-columns: 1fr 2fr; }
.p { grid-template-columns: 1fr auto; }
.content { min-height: 300px; }
</style>