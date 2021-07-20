<!-- Create By xBoson System -->

<template>
<draggable 
  :group="{ name: 'app-bind-menu', put: true }" 
  :list="menu"
  :swapThreshold='10'
  chosenClass="cl-drag-drop-component-chosen" 
  ghostClass='cl-drag-drop-component-ghost' 
  dragClass='cl-drag-drop-component-drag'
  @add='add' 
>
  <div v-for='(m, i) in menu' :key='i'>
    <div v-if='m.isContainer' class='c'>
      <div class='items-group bs1'>
        <i :class='[m.icon, "ti", "ic"]'></i>
        <input v-model='m.title' class='ti'/> 
        
        <a-popconfirm
          title="删除当前菜单, 以及子菜单?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="del(i)"
        >
          <a-button size='small' icon='delete' type='dashed'/>
        </a-popconfirm>
        
        <a-button size='small' icon='edit' @click='openEdit(i, m)'/>
        <a-button size='small' icon='plus' @click='appendContainer(m)'/>
        <a-button size='small' icon="minus" v-if='m.isShow' @click='m.isShow=!m.isShow'/>
        <a-button size='small' icon="arrows-alt" v-else @click='m.isShow=!m.isShow'/>
      </div>
      
      <cl-app-bind-menu-set 
        :menu='m.child' 
        :nomenu='nomenu' 
        :deep='deep+1' 
        :newMenu='newMenu'
        class='p h' 
        v-if='m.isShow'/>
    </div>
     
    <div v-else class='items-group bs2 p'>
      <a-button><i :class='["bic", nomenu[m.id].icon]'></i>{{ nomenu[m.id].title }}</a-button>
      
      <a-popconfirm
        title="删除当前菜单?"
        ok-text="删除"
        cancel-text="取消"
        @confirm="del(i)"
      >
        <a-button icon='delete' type='dashed'/>
      </a-popconfirm>
    </div>
  </div>
  
  <cl-app-menu-item-edit :visible.sync='showEdit' v-model='tempitem' @ok='onOk'/>
</draggable>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['menu', 'nomenu', 'deep', 'newMenu'],
  
  components: tool.loadc('cl-app-bind-menu-set', 'cl-app-menu-item-edit'),
  
  data() {
    return {
      tempitem: {},
      showEdit: false,
      index   : null,
    };
  },
  
  methods : {
    del(i) {
      this.menu.splice(i, 1);
    },
    
    openEdit(i, m) {
      this.index = i;
      this.tempitem = m;
      this.showEdit = true;
    },
    
    onOk() {
      this.$set(this.menu, this.index, Object.assign({}, this.tempitem));
    },
    
    appendContainer(m) {
      m.isShow = true;
      m.child.push(this.newMenu('标题'+(this.deep)+'-'+(1+m.child.length)));
    },
    
    add(ev) {
      if (ev.item.dataId) {
        this.menu.splice(ev.newIndex, 1, {
          id : ev.item.dataId,
          isContainer : false,
        });
      }
    },
  },
}
</script>

<style scoped>
.c {
  border: 1px dashed #ddd; margin: 5px 0; padding: 3px;
}
.bs1 {
  grid-template-columns: auto 1fr auto auto auto auto; margin-bottom: 2px; 
}
.bs2 {
  grid-template-columns: 1fr auto auto auto auto; margin-bottom: 2px; 
}
.ti {
  border: 1px dashed #bbb; border-width: 0 0 1px 0;
}
.p {
  padding: 5px 3px; 
}
.h {
  min-height: 70px; transition: 0.2s;
}
.ic {
  padding-top: 5px;
}
.bic {
  float: left; padding-top: 3px;
}
</style>