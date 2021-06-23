<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <a-directory-tree
      :replace-fields='replaceFields'
      :load-data="onLoadData" 
      :tree-data='dirData'
      @select='onSelect'
    />
    
    <div class='edit'>
      <div v-if='showButton'>
        <a-tooltip placement="top">
          <template slot="title">
            创建目录
          </template>
          <a-button icon='plus' @click='openAdd' v-if='selected.isDir'></a-button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            重命名
          </template>
          <a-button icon='edit' @click='openEdit' v-if='!selected.readOnly'></a-button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            删除
          </template>
          <a-button icon='delete' @click='openDel' v-if='!selected.readOnly'></a-button>  
        </a-tooltip>
        
        <section>
          <div v-if='selected.ctime'>
            <span class='note'>创建时间</span> 
            <span>{{selected.ctime}}</span>
            <span class='user'>{{selected.cuser}}</span>
          </div>
          <div v-if='selected.mtime'>
            <span class='note'>修改时间</span> 
            <span>{{selected.mtime}}</span>
            <span class='user'>{{selected.muser}}</span>
          </div>
        </section>
        <section class='note'>
          推荐目录结构: [项目]/应用/模块/页面
        </section>
      </div>
      
      <div v-if='state == 1'>
        <h3>{{form.title}}</h3>
        <a-form-model :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }"
          :rules="rules" ref='createForm' showIcon='true'>
          <a-form-model-item label="文件名" prop='name'>
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onCreate">
              确定
            </a-button>
            <a-button style="margin-left: 10px;" @click='state = 0'>
              关闭
            </a-button>
          </a-form-model-item>
        </a-form-model> 
      </div>
      
      <div v-if='state == 2'>
        <p>即将删除: {{this.selected.name}}</p>
        <a-button type='danger' @click='doDelete'>立即删除</a-button>
        <a-button @click='state=0' >取消</a-button>
      </div>
      
    </div>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: {
    preDelete: {
      required: true,
      type: Function,
    },
  },
  
  data() {
    let name = this.$store.state.project.name;
    return {
      form : null,
      selected: null,
      state : 0,
      
      rules : {
        name : [
          { required: true, message: '请输入有效文件名' }
        ]
      },
      
      replaceFields : {
        children:'child', title:'name', key:'_id'
      },
      
      dirData : [
        { name, _id:'/', readOnly: true, isDir: true },
      ],
    };
  },
  
  computed: {
    showButton() {
      return this.state == 0 && this.selected != null && this.selected._id;
    },
  },
  
  methods : {
    onSelect(s, e) {
      let n = e.selectedNodes[0];
      if (n && n.dataRef) {
        this.selected = n.dataRef;
      }
    },
    
    openAdd() {
      this.form = { 
        parentid  : this.selected._id,
        name      : '',
        title     : '新建目录',
        api       : 'mkdir',
        cb        : this.createBack,
      };
      this.state = 1;
    },
    
    openDel() {
      this.form = {
        _id : this.selected._id,
      },
      this.state = 2;
    },
    
    openEdit() {
      this.form = { 
        _id       : this.selected._id,
        name      : this.selected.name,
        title     : '重命名',
        api       : 'rename',
        cb        : this.editBack,
      };
      this.state = 1;
    },
    
    editBack(ret) {
      this.state = 0;
      this.selected.name = this.form.name;
      this.updateTree();
      this.$emit('changeName', this.form);
    },
    
    createBack(ret) {
      this.state = 0;
      this.dir(this.selected._id, (err, data)=>{
        if (err) {
          this.error(err);
        } else {
          this.selected.child = data;
          this.updateTree();
        }
      });
    },
    
    doDelete() {
      let delmsg = this.preDelete(this.selected._id);
      if (delmsg) {
        this.$notification.open({
          message: '删除失败',
          description: delmsg,
        });
        return;
      }
      
      tool.api('file', 'del', this.form, (err, ret)=>{
        if (err) return this.error(err);
        this.state = 0;
        //TODO: 删除节点
        this.selected.name = '--';
        this.selected._id = '';
      });
    },
    
    error(err) {
      xv.popError('错误', err);
    },
    
    onCreate() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          tool.api('file', this.form.api, this.form, (err, ret)=>{
            if (err) {
              this.error(err);
            } else {
              this.form.cb(ret);
            }
          });
        } else {
          return false;
        }
      });
    },
    
    dir(parentid, cb) {
      let parm = {
        parentid,
      };
      
      tool.api('file', 'dir', parm, (err, ret)=>{
        if (err) {
          cb(err);
        } else {
          ret.data.forEach(function(d) {
            if (!d.isDir) {
              d.isLeaf = true;
            }
          });
          cb(null, ret.data);
        }
      });
    },
    
    onLoadData(n) {
      return new Promise((resolve,reject) => {
        if (!n.dataRef.isDir) {
          resolve();
          return;
        }
        
        this.dir(n.dataRef._id, (err, data)=>{
          n.dataRef.child = data.sort(tool.filesort);
          this.updateTree();
          resolve();
        });
      });
    },
    
    updateTree() {
      this.dirData.sort();
    },
  },
}
</script>

<style scoped>
.main {
  display: grid; grid-template-columns: 50% 50%; gap: 10px;
  grid-auto-rows: 1fr; min-height: 300px; padding: 30px; overflow-y: auto;
}
.main > * {
  padding: 20px; 
}
.main > *:first-of-type {
  border-right: 1px solid #ccc;
}
section {
  margin-top: 50px;
}
section span {
  margin-right: 15px;
}
.user {
  color: green;
}
</style>