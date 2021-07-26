<!-- Create By xBoson System -->

<template>
  <cl-progress-step :value='value' :processes='processes'/>
</template>

<script>
const tool = require("./tool.js");

export default {
  components : tool.loadc('cl-progress-step'),
  
  data() {
    return {
      value: {
        // 创建/修改应用
        app : null,
        createMode : null,
      },
      
      processes: {
        'default': [
          { title: '应用', desc:'列出可用应用列表', component: 'cl-app-list' },
        ],
        
        'createApp': [
          { title: '创建应用', desc: '应用创建于项目目录内', component: 'cl-app-create' },
          { title: '应用菜单', desc: '制作应用菜单', component: 'cl-app-bind-menu' },
        ],
        
        'editApp': [
          { title: '修改应用', desc: '当前应用状态', component: 'cl-app-create' },
        ],
        
        'appMenu': [
          { title: '应用菜单', desc: '制作应用菜单', component: 'cl-app-bind-menu' },
        ],
        
        'editVuex': [
          { title: '状态管理', desc: '编辑 Vuex 配置文件', component: 'cl-app-vuex-edit' },
        ],
      },
    };
  },

  beforeDestroy() {
    this.$store.commit('setMenuClipboard', null);
    // console.log("clear menu clipboard");
  },
}
</script>

<style scoped>
</style>