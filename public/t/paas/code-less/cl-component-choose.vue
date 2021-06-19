<!-- Create By xBoson System -->

<template>
  <a-collapse class='components'>
    
    <a-collapse-panel v-for="(c, i) in componentLibrary" :key="i" :header="c.title">
      
      <draggable :group="{ name: 'ui-component', pull: 'clone', put: false }" 
                v-model="c.list" chosenClass="clst-chosen" ghostClass='clst-ghost' @start='start'>
        <span v-for="(e, idx) in c.list" :id.prop='e.id'>{{e.txt}}</span>
      </draggable>
      
    </a-collapse-panel>
    
  </a-collapse>
</template>

<script>
const clib = require("./component-library.js");

loadLib('基础组件', './basic.js');

export default {
  data() {
    let data = { 
      componentLibrary: clib.getLibrary(),
    };
    return data;
  },
  
  methods : {
    start() {
      this.$store.commit('closeDropTip');
    }
  },
}


function loadLib(name, path) {
  require(path, 1).then(function(list) {
    clib.loadLib(name, list);
  });
}
</script>

<style scoped>
.components span {
  display: inline-block; padding: 3px 10px; border: 1px dashed #ccc; margin: 3px 2px; cursor: move;
  width: calc(50% - 4px);
}
</style>