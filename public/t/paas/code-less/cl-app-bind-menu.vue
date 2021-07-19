<!-- Create By xBoson System -->

<template>
  <div class='items-group m' ref='maincontainer'>
    <div class='content max'>
      <h4>菜单映射列表</h4>
      
      <draggable 
          :group="{ name: 'app-bind-menu', pull: 'clone', put: false }" 
          :value="nomenuArray"
          chosenClass="cl-drag-drop-component-chosen" 
          ghostClass='cl-drag-drop-component-ghost' 
      >
        <div v-for='(m, i) in nomenuArray' class='items-group bs' :key='m.id' :data-id.prop='m.id'>
          <a-button>{{ m.title }}</a-button>
          <a-button icon='edit' @click='editNom(m.id, m)'/>
          <a-popconfirm
            title="删除当前菜单映射, 并删除关联菜单?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delNom(m.id)"
          >
            <a-button icon='delete'/>
          </a-popconfirm>
        </div>
      </draggable>
      
      <cl-add-button @click='addNom' title='菜单映射' style='margin-top: 2px;'/>
      
      <div style='margin-top: 10px'>
        <a-button @click='doUpdate' type='primary'>递交</a-button>
        <a-button @click='$emit("previous")' icon='rollback'>返回</a-button>
      </div>
    </div>
    
    <div class='max'>
      <h4>菜单</h4>
      
      <div class='note h' v-if='nomenuArray.length < 1'>
        首先创建 ‘菜单映射’
      </div>
      <div style='display: inline-block' v-else>
        <cl-add-button @click='prepareMenu' title='菜单组' style='width: 100%'/>
      
        <cl-app-bind-menu-set :menu='menu' :nomenu='nomenu' :deep='1' />
        
        <div class='note h' v-if='menu.length < 1'>
          请点击 ‘添加菜单组’
        </div>
        <div class='note h' v-else> 
          拖拽 ‘菜单映射’ 中的项目到 ‘菜单组’ 中
        </div>
        
        <cl-add-button @click='appendMenu' title='菜单组' style='width: 100%'/>
      </div>
    </div>
    
    <a-modal
      title="菜单信息"
      :visible="showEditDialog"
      @ok="setNomenu"
      @cancel="showEditDialog = false"
    >
      <a-form-model :model="currnomenu" :rules="rules" ref='itemForm'
          :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item label="菜单标题" prop='title'>
          <a-input v-model='currnomenu.title' placeholder='中文名'/>  
        </a-form-model-item>
        
        <a-form-model-item label="虚拟路径" prop='path'>
          <a-input v-model='currnomenu.path' placeholder='/a/b/c'/>
        </a-form-model-item>
        
        <a-form-model-item label="关联文件" prop='fid'>
          <cl-file-selector
            style='width: 100%'
            placeholder="请选择文件"
            v-model='currnomenu.fid'
            :dirCanSelect='false'/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props : ['data', 'next'],
  
  components: tool.loadc('cl-file-selector', 'cl-app-bind-menu-set'),
  
  computed : {
    nextid() {
      let i = this.id;
      while (this.nomenu['nm'+ i]) {
        ++i;
      }
      this.id = i+1;
      return 'nm'+ i;
    },
    
    nomenuArray() {
      let arr = [];
      for (let id in this.nomenu) {
        arr.push(Object.assign({id}, this.nomenu[id]));
      }
      return arr;
    },
  },
  
  mounted() {
    this.getApp();
  },
  
  data() {
    return {
      id : 1,
      menu : [],
      nomenu : {},
      
      showEditDialog : false,
      editOnAdd : false,
      editId : null,
      currnomenu : {
        title:'', fid:'', path:'',
      },
      
      rules: {
        title : { required: true, message: '必须输入标题' },
        path  : { required: true, message: '必须输入路径' },
        fid   : { required: true, message: '必须选择文件' },
      },
    };
  },
  
  methods : {
    getApp() {
      tool.api('appdev', 'applist', {_id: this.data.app._id}, (err, ret)=>{
        if (err) return this.next(err);
        
        this.merginArr(this.menu, ret.data[0].menu);
        this.marginObj(this.nomenu, ret.data[0].nomenu);
        // this.$forceUpdate();
      });
    },
    
    merginArr(target, from) {
      from.forEach(x=>target.push(x));
      return target;
    },
    
    marginObj(target, from) {
      for (let n in from) {
        this.$set(target, n, from[n]);
      }
    },
    
    newMenu() {
      return {
        title: '标题'+ (1+this.menu.length),
        isContainer: true,
        child: [],
        isShow: true,
      };
    },
    
    appendMenu() {
      this.menu.push(this.newMenu());
    },
    
    prepareMenu() {
      this.menu.splice(0,0, this.newMenu());
    },
    
    doUpdate() {
      let q = {
        _id     : this.data.app._id, 
        menu    : JSON.stringify(this.menu), 
        nomenu  : JSON.stringify(this.nomenu),
      };
      tool.api('appdev', 'appedit', q, (err, ret)=>{
        if (err) return this.next(err);
        antd.message.success('菜单已更新');
        this.$emit('clear');
      });
    },
    
    addNom() {
      this.currnomenu = { title:'', fid:'', path:'', };
      this.editOnAdd = true;
      this.editId = null;
      this.showEditDialog = true;
    },
    
    editNom(id, m) {
      this.currnomenu = Object.assign({}, m);
      this.editOnAdd = false;
      this.editId = id;
      this.showEditDialog = true;
    },
    
    setNomenu() {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          if (this.findNameRepeat(this.currnomenu.title)) {
            antd.message.error("菜单标题重复");
            return false;
          }
          
          let newMenu = Object.assign({}, this.currnomenu);
          if (this.editOnAdd) {
            this.$set(this.nomenu, this.nextid, newMenu);
          } else {
            this.$set(this.nomenu, this.editId, newMenu);
          }
          this.showEditDialog = false;
          return true;
        }  
        return false;
      });
    },
    
    findNameRepeat(name) {
      for (let k in this.nomenu) {
        if (this.nomenu[k].title == name) {
          if (this.editId != k) {
            return true;
          }
        }
      }
    },
    
    delNom(id) {
      this.$delete(this.nomenu, id);
      this.removeMenuRef(this.menu, id);
    },
    
    removeMenuRef(m, id) {
      for (let i=0; i<m.length; ++i) {
        if (m[i].id == id) {
          m.splice(i, 1);
          --i;
        }
        else if (m[i].isContainer) {
          this.removeMenuRef(m[i].child, id);
        }
      }
    },
  },
}
</script>

<style scoped>
.m {
  grid-template-columns: 2fr 5fr 
}
.bs {
  grid-template-columns: 1fr auto auto; margin-bottom: 2px;
}
.max {
  max-height: calc(100vh - 80px - 150px); overflow-y: auto; 
}
</style>