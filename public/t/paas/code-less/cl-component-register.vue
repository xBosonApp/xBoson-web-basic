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
        clib : null, // 当前选中的组件库
        ret  : null, // 页面切换返回值
        bind : null, // 绑定组件对象
      }, 
      
      processes : {
        'default': [
          { title: '组件库', desc:'列出项目可用组件库', component: 'cl-reg-clib-list' },
        ],
        
        createCLib : [
          { title: '创建组件库', component: 'cl-reg-clib-create' },
        ],
        
        editCLib : [
          { title: '编辑组件库', desc:'组件库基础信息', component: 'cl-reg-clib-create' },
        ],
        
        openClib : [
          { title: '组件库设定', desc:'组件库中的组件列表', component: 'cl-reg-bind-list' },
        ],
        
        createBind : [
          { title: '绑定组件', desc:'为组件库绑定组件', component: 'cl-reg-bind-create' },
          { title: '组件属性', desc:'绑定组件的属性定义', component: 'cl-reg-bind-prop' },
        ],
        
        editProps : [
          { title: '组件属性', desc:'绑定组件的属性定义', component: 'cl-reg-bind-prop' },
        ],
      },
    };
  },
}
</script>

<style scoped>
</style>