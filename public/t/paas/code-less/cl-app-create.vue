<!-- Create By xBoson System -->

<template>
<div>
  <a-form-model :model="form" ref="ruleForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="应用名称" prop="name">
      <a-input v-model="form.name" />
    </a-form-model-item>
    
    <a-form-model-item label="菜单模式" prop="mode" v-if='isCreate'>
      <a-radio-group v-model="form.mode">
        <a-radio v-for='(txt, k) in modeMap' :value="k">
          {{ txt }}
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    
    <div v-if='isRename' class='items-group as'>
      <label>首页</label>
      <div>
        <a :href='path'>{{ path }}</a>  
      </div>
      
      <label>菜单类型</label>
      <div>{{ modename }}</div>
      
      <label>创建人</label>
      <div>
        <div>{{ data.app.cuser }}</div>
      </div>
      
      <label>创建时间</label>
      <div>
        <div>{{ data.app.ctime }}</div>
      </div>
      
      <label>最后修改人</label>
      <div>
        <div>{{ data.app.muser }}</div>
      </div>
      
      <label>最后修改时间</label>
      <div>
        <div>{{ data.app.mtime }}</div>
      </div>
      
      <span></span>
      <div class='note'>修改应用名称不会改变物理目录</div>
    </div>
    
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        <span v-if='isCreate'>
          创建应用
        </span>
        <span v-else>
          修改应用
        </span>
      </a-button>
      
      <a-button @click='$emit("previous")'>返回</a-button>
    </a-form-model-item>
  </a-form-model>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['data', 'next'],
  
  computed : {
    isCreate() {
      return this.data.createMode == 'create';
    },
    isRename() {
      return this.data.createMode == 'rename';
    },
    path() {
      if (this.isRename) {
        let p = this.data.app.path;
        let i = p.indexOf('/', 1);
        return xv.url_prefix +(xv.debug ? '/t' : '/ui')+ p.substr(i) +'/index.htm';
      }
      return '';
    },
    modename() {
      return this.modeMap[ this.data.app.mode ] || '未知类型的应用';
    },
  },
  
  data() {
    let name = (this.data.createMode == 'create') ? '' : this.data.app.name;
    return {
      labelCol : { span: 4 },
      wrapperCol : { span: 14 },
      
      form : {
        name,
        mode : 'pc',
      },
      
      modeMap: {
        'pc'     : '计算机应用',
        'mobile' : '移动应用',
      },
      
      rules : {
        name : { required: true, message: '应用名称不能为空', trigger: 'blur' },
      },
    };
  },
  
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return false;
        if (this.isCreate) { 
          this.doCreate();
        } else if (this.isRename) {
          this.doRename();
        }
      });
    },
    
    doCreate() {
      tool.api('appdev', 'appadd', this.form, (err, ret)=>{
        this.next(err, ret, {app:ret});
      });
    },
    
    doRename() {
      this.form._id = this.data.app._id;
      tool.api('appdev', 'apprename', this.form, (err, ret)=>{
        this.next(err, ret, {app:ret});
      });
    },
  },
}
</script>

<style scoped>
.as {
  grid-template-columns: 4fr 20fr; gap: 3px 10px;
}
.as label {
  text-align: right;
}
.as label:after { content: ":"; }
</style>