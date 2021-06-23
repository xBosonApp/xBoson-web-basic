<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <a-directory-tree
      :replace-fields='replaceFields'
      :load-data="onLoadData" 
      :tree-data='dirData'
      @select='onSelect'
    />
    <div v-if='isFile'>
      <a-button @click='open' type='primary'>打开文件</a-button>
      <a-button @click='close()'>关闭</a-button>
      <section>
        <h4>{{selected.name}}</h4>
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
    </div>
    <div v-else>
      <a-button @click='close()' icon='close'></a-button>
    </div>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  data() {
    let name = this.$store.state.project.name;
    
    return {
      isFile: false,
      selected: {},
      
      replaceFields : {
        children:'child', title:'name', key:'_id'
      },
      
      dirData : [
        { name, _id:'/', readOnly: true, isDir: true, selectable: false },
      ],
    }
  },
  
  methods: {
    onSelect(s, e) {
      let n = e.selectedNodes[0];
      let d = n && n.dataRef;
      if (d) {
        this.selected = d;
        this.isFile = !d.isDir;
      }
    },
    
    open() {
      this.$emit('open-file', this.selected._id);
      this.close();
    },
    
    close() {
      this.$emit('close');
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
            } else {
              d.selectable = false;
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