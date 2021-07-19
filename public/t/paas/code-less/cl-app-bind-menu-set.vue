<!-- Create By xBoson System -->

<template>
<draggable 
  :group="{ name: 'app-bind-menu', put: true }" 
  :list="menu"
  :swapThreshold='10'
  chosenClass="cl-drag-drop-component-chosen" 
  ghostClass='cl-drag-drop-component-ghost' 
  @add='add' 
>
  <div v-for='(m, i) in menu' :key='i'>
    <div v-if='m.isContainer' class='c'>
      <div class='items-group bs'>
        <input v-model='m.title' class='ti'/> 
        
        <a-popconfirm
          title="删除当前菜单, 以及子菜单?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="del(i)"
        >
          <a-button size='small' icon='delete'/>
        </a-popconfirm>
        
        <a-button size='small' icon='plus' @click='appendContainer(m)'/>
      
        <a-button size='small' icon="minus" v-if='m.isShow' @click='m.isShow=!m.isShow'/>
        <a-button size='small' icon="arrows-alt" v-else @click='m.isShow=!m.isShow'/>
      </div>
      
      <transition
        enter-class='animate__animated animate__fadeInUp'
        enter-to-class='animate__animated animate__fadeInUp'
        leave-to-class='animate__animated animate__fadeOutDown'
      >
        <cl-app-bind-menu-set :menu='m.child' :nomenu='nomenu' :deep='deep+1' class='p h' v-if='m.isShow'/>
      </transition>
    </div>
    
    <div v-else class='items-group bs p'>
      <a-button>{{ nomenu[m.id].title }}</a-button>
      
      <a-popconfirm
        title="删除当前菜单?"
        ok-text="删除"
        cancel-text="取消"
        @confirm="del(i)"
      >
        <a-button icon='delete'/>
      </a-popconfirm>
    </div>
  </div>
</draggable>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['menu', 'nomenu', 'deep'],
  
  components: tool.loadc('cl-app-bind-menu-set'),
  
  data() {
    return {
    };
  },
  
  methods : {
    del(i) {
      this.menu.splice(i, 1);
    },
    
    appendContainer(m) {
      m.child.push({
        title: '标题'+(this.deep)+'-'+(1+m.child.length),
        isContainer: true,
        child: [],
        isShow: true,
      });
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
.bs {
  grid-template-columns: 1fr auto auto auto; margin-bottom: 2px; 
}
.ti {
  border: 1px dashed #bbb; border-width: 0 0 1px 0;
}
.p {
  padding: 5px 3px; 
}
.h {
  min-height: 70px;
}
</style>