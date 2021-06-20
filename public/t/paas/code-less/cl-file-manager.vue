<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <div class='tree'>
      <a-directory-tree
        show-line="true"
        show-icon="true"
        :replace-fields='replaceFields'
        :load-data="onLoadData" 
        :tree-data='dirData'
        @select='onSelect'
      />
    </div>
    
    <div class='edit'>
      <div v-if='showButton'>
        <a-button icon='plus' @click='openAdd'></a-button>
        <a-button icon='edit' @click='openEdit' v-if='!selected.readOnly'></a-button>
        <a-button icon='delete' @click='openDel' v-if='!selected.readOnly'></a-button>
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
        <a-button type='danger' @click='doDelete'>删除目录</a-button>
        <p>{{this.selected.name}}</p>
      </div>
      
    </div>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
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
      tool.api('file', 'del', this.form, (err, ret)=>{
        if (err) return this.error(err);
        this.state = 0;
        this.selected.name = '--';
        this.selected._id = '';
      });
    },
    
    error(err) {
      xv.popError('错误', err.message);
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
          n.dataRef.child = data;
          this.updateTree();
          resolve();
        });
      });
    },
    
    updateTree() {
      this.dirData = [...this.dirData];
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
</style>