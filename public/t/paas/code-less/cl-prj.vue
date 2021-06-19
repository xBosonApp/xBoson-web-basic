<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <div class='list'>
      <x-api org='a297dfacd7a84eab9656675f61750078'
        app='19cb7c3b79e949b88a9c76396854c2b1'
        mod='prjmgr' api='listprj' :flag='f2'
        @success='setPrjList' :params='listParams'/>
        
      <h3>项目列表</h3>
      <div class='prjlist'>
        <section v-for='(p, i) in prjlist'>
          <a-button block :key='i' @click='openPrj(p)'>{{p.name}}</a-button>
          <a-button :key='i' icon='edit' @click='setEdit(p)'></a-button>
        </section>
      </div>
    </div>
    
    <div v-if='stage == 0' key='1'>
      <a-tooltip placement="right">
        <template slot="title">
          <span>创建项目</span>
        </template>
        <a-button icon='plus' @click='openNew'></a-button>
      </a-tooltip>
      <a-comment>
        <p slot="content">{{message}}</p>
      </a-comment>
    </div>
    
    <div class='create' v-else key='2'>
      <h3 v-if='stage == 1'>创建新项目</h3>
      <h3 v-if='stage == 2'>项目属性</h3>
      
      <a-form-model :model="createParams" :label-col="{ span: 4 }" ref='ruleForm'
          :wrapper-col="{ span: 14 }" @submit='submit' :rules="rules">
        
        <x-api org='a297dfacd7a84eab9656675f61750078'
          app='19cb7c3b79e949b88a9c76396854c2b1'
          mod='prjmgr' :api='api' :params='createParams'
          @success='createSuccess' :immediately='false' :flag='f1'/>
          
        <a-form-model-item label='项目名称' prop='name'>
          <a-input v-model="createParams.name"/>
        </a-form-model-item>
        
        <a-form-model-item label='MongoDB URL' prop='url'>
          <a-input v-model="createParams.url" :disabled='stage != 1'/>
        </a-form-model-item>
        
        <a-form-model-item label='数据库名' prop='db'>
          <a-input v-model="createParams.db" defaultValue='code-less-prj' 
            :disabled='stage != 1'/>
        </a-form-model-item>
        
        <a-form-model-item label='可访问角色'>
          <x-api org='a297dfacd7a84eab9656675f61750078'
            app='19cb7c3b79e949b88a9c76396854c2b1'
            mod='prjmgr' api='roleslist' 
            @success='setRolesList' />
            
          <a-select
            mode="multiple"
            v-model='createParams.roles'
            placeholder="角色列表">
            <a-select-option v-for="(p, i) in rolelist" :key="p.id">
              {{p.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" html-type="submit" v-if='stage == 1'>
            创建
          </a-button>
          <a-button type="primary" html-type="submit" v-if='stage == 2'>
            修改
          </a-button>
          <a-button @click='close' style="margin-left: 10px;">
            关闭
          </a-button>
          <a-button type='danger' html-type="submit" v-if='stage == 2' 
            style="margin-left: 30px;" @click='preDelete'>
            删除
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    
    <a href='http://xboson.net' class='cp' target="_blank">xBoson 低代码开发平台</a>
  </div>
</template>

<script>
let defurl = 'mongodb://mongo-x';
let defdb = 'code-less-prj';

export default {
  data() {
    return {
      f1:0, f2:0,
      rolelist:[],
      prjlist:[],
      listParams:{},
      stage:0,
      message:'',
      
      createParams: {
        name:'',
        roles:[],
        url:defurl,
        db:defdb,
      },
      
      rules: {
        name: [{ required: true, message: '必须输入有效名称', trigger: 'blur' }],
        url : [{ required: true, message: '必须输入数据库url', trigger: 'blur' }],
        db  : [{ required: true, message: '必须输入基础库名', trigger: 'blur' }],
      },
    }
  },
  
  computed : {
    api() {
      return [null, 'createprj', 'modifyprj', 'delprj'][this.stage];
    }
  },
  
  methods : {
    setPrjList(v) {
      this.prjlist = v.data;
    },
    
    setRolesList(v) {
      this.rolelist = v.roles;
    },
    
    setEdit(prj) {
      this.stage = 2;
      ['name', 'roles', '_id', 'url', 'db'].forEach(n=>{
        this.createParams[n] = prj[n];
      });
    },
    
    createSuccess(r) {
      ++this.f2;
      this.stage = 0;
      this.message = r.msg;
    },
    
    openNew() {
      this.stage = 1;
      this.createParams.name = '';
      this.createParams.roles = [];
      this.createParams._id = null;
      this.createParams.url = defurl;
      this.createParams.db = defdb;
    },
    
    submit(e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ++this.f1;
        } else {
          return false;
        }
      });
    },
    
    close() {
      this.stage = 0;
      this.message = '';
    },
    
    preDelete() {
      this.stage = 3;
      this.submit();
    },
    
    openPrj(p) {
      this.$emit('open', p);
      this.close();
    },
  }
}
</script>

<style scoped>
.main {
  display: grid; grid-template-columns: 50% 50%; gap: 10px;
  grid-auto-rows: 1fr; height: 100vh; padding: 80px;
}
.list {
  border-right: 1px solid #ccc; height: 100%; overflow-y: auto;
}
.list, .create {
  padding: 20px; 
}
.prjlist section {
  padding: 0 20px 0 50px; display: grid; gap: 5px;
  grid-template-columns: 1fr 100px; 
}
.cp {
  position: fixed; bottom: 5px; right: 5px; color: #eee;
}
</style>