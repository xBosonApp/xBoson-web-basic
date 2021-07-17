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
      },
      
      processes: {
        'default': [
          { title: '应用', desc:'列出可用应用列表', component: 'cl-app-list' },
        ],
      },
    };
  },
}
</script>

<style scoped>
</style>