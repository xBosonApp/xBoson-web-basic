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
          :wrapper-col="{ span: 14 }" :rules="rules">
        
        <x-api org='a297dfacd7a84eab9656675f61750078'
          app='19cb7c3b79e949b88a9c76396854c2b1'
          mod='prjmgr' :api='api' :params='createParams'
          @success='createSuccess' :immediately='false' :flag='f1'/>
          
        <a-form-model-item label='项目名称' prop='name'>
          <a-input v-model="createParams.name"/>
        </a-form-model-item>
        
        <a-form-model-item label='Mongo URL' prop='url'>
          <a-input v-model="createParams.url" :disabled='stage != 1'/>
        </a-form-model-item>
        
        <a-form-model-item label='数据库名' prop='db'>
          <a-input v-model="createParams.db" defaultValue='code-less-prj' 
            :disabled='stage != 1'/>
        </a-form-model-item>
        
        <a-form-model-item label='平台机构' prop='orgid'>
          <a-tree-select 
            :disabled='stage != 1'
            v-model='createParams.orgid'
            :tree-data="orgList"
            @change='clearBasedir' 
          />
          <!--<a-input v-else v-model="createParams.orgid" disabled/>-->
        </a-form-model-item>
        
        <a-form-model-item label='UI根目录' prop='basedir'>
          <a-tree-select
            v-if='stage == 1'
            v-model="createParams.basedir"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="项目中的文件存放目录"
            allow-clear
            :tree-data="dirData"
            :load-data="onLoadDirData"
          />
          <a-input v-else v-model="createParams.basedir" disabled/>
        </a-form-model-item>
        
        <a-form-model-item label='所有者' v-if='stage == 2'>
          <a-input v-model="createParams.owner" :disabled='true'/>
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
          <a-button type="primary" @click="submit" v-if='stage == 1'>
            创建
          </a-button>
          <a-button type="primary" @click="submit" v-if='stage == 2'>
            修改
          </a-button>
          <a-button @click='close' style="margin-left: 10px;">
            关闭
          </a-button>
          <a-button type='danger' v-if='stage == 2' 
            style="margin-left: 30px;" @click='preDelete'>
            删除
          </a-button>
          
          <a-tooltip placement='right'>
            <template slot="title">
              项目操作中可能会覆盖已有文件!
            </template>
            <a-switch checked-children="允许非空目录" v-if='stage == 1'
              un-checked-children="必须空目录" style='margin-left: 30px'
              v-model='createParams.nonemtp'/>
          </a-tooltip>
        </a-form-model-item>
      </a-form-model>
    </div>
    
    <a href='http://xboson.net' class='cp' target="_blank">xBoson 低代码开发平台</a>
  </div>
</template>

<script>
const p = xv.ctx_prefix;
const filelisturl = p +'/app/a297dfacd7a84eab9656675f61750078/ZYAPP_IDE/ZYMODULE_UI_IDE/getfilelist';
const orglisturl = p +'/user/getuserorg?app=ZYAPP_LOGIN&mod=ZYMODULE_LOGIN&openid=';
const openidurl = p +'/app/a297dfacd7a84eab9656675f61750078/19cb7c3b79e949b88a9c76396854c2b1/prjmgr/getopenid';
const defurl = 'mongodb://mongo-x';
const defdb = 'code-less-prj';
const tool = require('./tool.js');

export default {
  data() {
    this.getOpenID();
    return {
      f1:0, f2:0,
      rolelist:[],
      prjlist:[],
      listParams:{},
      stage:0,
      message:'',
      
      dirData:[ ],
      orgList:[],
      openid : null, 
      
      createParams: {
        name:'',
        roles:[],
        url:defurl,
        db:defdb,
        basedir:'',
        nonemtp:false,
        orgid:'',
      },
      
      rules: {
        name    : [{ required: true, message: '必须输入有效名称', trigger: 'blur' }],
        url     : [{ required: true, message: '必须输入数据库url', trigger: 'blur' }],
        db      : [{ required: true, message: '必须输入基础库名', trigger: 'blur' }],
        basedir : [{ required: true, message: '必须选择一个存储目录', }],
        orgid   : [{ required: true, message: '必须选择一个机构', }],
      },
    }
  },
  
  computed : {
    api() {
      return [null, 'createprj', 'modifyprj', 'delprj'][this.stage];
    }
  },
  
  methods : {
    error(e) {
      xv.popError('错误', e);
    },
    
    clearBasedir() {
      let key = 'root:'+ (this.createParams.orgid);
      this.dirData = [ { title: '平台UI目录', value: '/', key, selectable: false } ];
    },
    
    onLoadDirData(treeNode) {
      return new Promise((resolve, reject) => {
        if (!this.createParams.orgid) {
          reject();
          return this.error(new Error("请先选择机构"));
        }
        
        let config = { emulateJSON:true };
        let params = {
          path : treeNode.dataRef.value,
          org  : this.createParams.orgid,
        };
        
        tool.apiurl(filelisturl, params, (e, ret)=>{
          if (e) {
            reject();
            this.error(e);
            return;
          }
          
          if (treeNode.dataRef.value == '/') {
            treeNode.dataRef.children = this.getChildList(ret.result.children);
          } else {
            treeNode.dataRef.children = this.getChildList(ret.result);
          }
          this.dirData = [...this.dirData];
          resolve();
        });
      });
    },
    
    getOpenID() {
      tool.apiurl(openidurl, {}, (err, ret)=>{
        if (err) return this.error(err);
        this.openid = ret.openid;
        this.getOrgList();
      });
    },
    
    getOrgList() {
      tool.apiurl(orglisturl + this.openid, {}, (e, ret)=>{
        if (e) return this.error(e);
        let list = [];
        ret.result.forEach(d=>{
          list.push({
            title : d.orgnm,
            key   : d.orgid,
            value : d.orgid,
          });
        });
        this.orgList = list;
      });
    },
    
    getChildList(arr) {
      let ch = [];
      arr.forEach(function(d) {
        if (d.virtual) return;
        if (d.isParent) {
          ch.push({
            title : d.name,
            key   : d.path,
            value : d.path,
          });
        }
      });
      return ch;
    },
    
    setPrjList(v) {
      this.prjlist = v.data;
    },
    
    setRolesList(v) {
      this.rolelist = v.roles;
    },
    
    setEdit(prj) {
      this.stage = 2;
      ['name', 'roles', '_id', 'url', 'db', 'owner', 'basedir', 'orgid'].forEach(n=>{
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
      this.createParams.owner = null;
      this.createParams.basedir = '';
      this.createParams.nonemtp = false;
      this.createParams.orgid = '';
    },
    
    submit(e) {
      // if (this.stage == 3) { // 如果开发时数据错误则强制删除
      //   ++this.f1;
      //   return;
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ++this.f1;
        } else {
          return false;
        }
      });
      return false;
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
  padding: 2px 20px 0 50px; display: grid; gap: 5px;
  grid-template-columns: 1fr 100px; 
}
.cp {
  position: fixed; bottom: 5px; right: 5px; color: #eee;
}
</style>