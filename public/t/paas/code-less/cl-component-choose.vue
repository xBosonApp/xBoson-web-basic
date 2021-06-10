<!-- Create By xBoson System -->

<template>
  <a-collapse v-model="activeKey" class='components'>
    <a-collapse-panel key="1" header="基础组件">
      <draggable :group="{ name: 'ui-component', pull: 'clone', put: false }" v-model="list"
          chosenClass="clst-chosen" ghostClass='clst-ghost' @start='start'>
        <span v-for="(e, idx) in list" :id.prop='e.id'>{{e.txt}}</span>
      </draggable>
    </a-collapse-panel>
    
    <a-collapse-panel key="2" header="布局" :disabled="false">
      <draggable :group="{ name: 'ui-component', pull: 'clone', put: false }">
        <div>文本</div>
        <div>标签</div>
        <div>段落</div>
        <div>标题1</div>
      </draggable>
    </a-collapse-panel>
    
    <a-collapse-panel key="3" header="智能表单" disabled>
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
let basic = require('./basic.js');

export default {
  data() {
    let data = { 
      list:[],
    };
    
    //TODO: 所有组件加载
    require('./basic.js', 1).then(function(b) {
      let list = [];
      for (let id in b) {
        list.push({
          id,
          txt : b[id].txt,
        });
      }
      data.list = list;
    });
    return data;
  },
  
  methods : {
    start() {
      this.$store.commit('closeDropTip');
    }
  }
}
</script>

<style scoped>
.components span {
  display: block; padding: 3px 10px; border: 1px dashed #ccc; margin: 3px 0; cursor: move;
}
</style>