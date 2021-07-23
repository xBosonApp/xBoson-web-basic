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
        dragClass='cl-drag-drop-component-drag'
        @start.once='showHelpBar = false'
      >
        <div v-for='(m, i) in nomenuArray' class='items-group bs' :key='m.id' :data-id.prop='m.id'>
          <a-button><i :class='[m.icon, "bic"]'></i>{{ m.title }}</a-button>
          <a-button icon='edit' @click='editNom(m.id, m)'/>
          <a-popconfirm
            title="删除当前菜单映射, 并删除关联菜单?"
            ok-text="删除"
            cancel-text="取消"
            @confirm="delNom(m.id)"
          >
            <a-button icon='delete' type='dashed'/>
          </a-popconfirm>
        </div>
      </draggable>
      
      <cl-add-button @click='addNom' title='菜单映射' style='margin-top: 2px;'/>
      
      <div style='margin-top: 10px'>
        <a-button-group>
        <a-button @click='doUpdate' type='primary'>递交</a-button>
        <a-button @click='doTable' icon='table'>一览</a-button>
        <a-button @click='$emit("previous")' icon='rollback'>返回</a-button>
        <a-button @click='doCopy' icon='copy' />
        <a-button @click='doPaste' icon='highlight' :disabled='cannotPaste' />
        </a-button-group>
      </div>
    </div>
    
    <div class='content max'>
      <h4>菜单</h4>
      <div class='nomenu' v-if='nomenuArray.length > 0'>
        <cl-add-button @click='prepareMenu' title='菜单组' style='width: 100%'/>
        <cl-app-bind-menu-set :menu='menu' :nomenu='nomenu' :newMenu='newMenu' :deep='1' />
        <cl-add-button @click='appendMenu' title='菜单组' style='width: 100%'/>
      </div>
    </div>
    
    <transition
      enter-to-class='animate__animated animate__bounceIn'
      leave-to-class='animate__animated animate__bounceOut'
    >
    <a-card title="操作帮助" class='help' v-if='showHelpBar'>
      <div class='h' v-if='nomenuArray.length < 1'>
        首先创建 ‘菜单映射’
      </div>
      <div style='display: inline-block' v-else>
        <div class='h' v-if='menu.length < 1'>
          请点击 ‘添加菜单组’
        </div>
        <div class='h' v-else> 
          拖拽 ‘菜单映射’ 中的项目到 ‘菜单组’ 中
        </div>
      </div>
      <div>首页的虚拟路径是 ‘/’</div>
    </a-card>
    </transition>
    
    <cl-app-menu-item-edit 
      :visible.sync='showEditDialog' 
      v-model='currnomenu'
      @ok='setNomenu'
    />
    
    <a-drawer
      title="菜单数据一览"
      placement="right"
      width='80%'
      :visible="showTable"
      @close="showTable = false"
    >
      <cl-app-menu-list :menu='menu' :nomenu='nomenu'/>
    </a-drawer>
    
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props : ['data', 'next'],
  
  components: tool.loadc(
    'cl-app-bind-menu-set', 
    'cl-app-menu-item-edit',
    'cl-app-menu-list'),
  
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
    
    cannotPaste() {
      return !this.$store.state.menuClipboard;
    },
  },
  
  mounted() {
    this.getApp();
  },
  
  data() {
    let currnomenu = this.newNoMenu();
    return {
      id : 1,
      menu : [],
      nomenu : {},
      
      showHelpBar : true,
      showEditDialog : false,
      showTable : false,
      editOnAdd : false,
      editId : null,
      currnomenu,
    };
  },
  
  methods : {
    getApp() {
      tool.api('appdev', 'applist', {_id: this.data.app._id}, (err, ret)=>{
        if (err) return this.next(err);
        
        this.merginArr(this.menu, ret.data[0].menu);
        this.marginObj(this.nomenu, ret.data[0].nomenu);
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
    
    newMenu(title) {
      if (!title) {
        title = '标题'+ (1+this.menu.length);
      }
      return {
        title, isContainer: true, child: [], isShow: true,
        roles: [], icon: null,
      };
    },
    
    newNoMenu() {
      return { title:'', fid:'', path:'', roles: [], icon: null };
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
      this.currnomenu = this.newNoMenu();
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
    
    doTable() {
      this.showTable = true;
    },
    
    doCopy() {
      this.$store.commit('setMenuClipboard', {
        menu   : this.menu,
        nomenu : this.nomenu,
      });
    },
    
    doPaste() {
      let d = JSON.parse(this.$store.state.menuClipboard);
      this.menu = d.menu;
      this.nomenu = d.nomenu;
    },
  },
}
</script>

<style scoped>
.m {
  grid-template-columns: 390px auto;
}
.bs {
  grid-template-columns: 1fr auto auto; margin-bottom: 2px;
}
.max {
  max-height: calc(100vh - 80px - 150px); overflow-y: auto; 
}
.help {
  position: fixed; right: 50px; top: 150px; min-width: 300px;
}
.nomenu {
  min-width: 260px; display: inline-block;
}
.bic {
  float: left; padding-top: 3px;
}
</style>