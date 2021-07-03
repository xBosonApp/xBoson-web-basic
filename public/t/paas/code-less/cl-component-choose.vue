<!-- Create By xBoson System -->

<template>
  <a-collapse class='components' 
    :bordered="false" 
    :defaultActiveKey='acted'
    @change="onChange">
    
    <a-collapse-panel v-for="(c, i) in libs" :key="i" :header="c.title">
      
      <div v-for='(list, gname) in c.group' :key='gname'>
        <div class='cl-classify'>{{gname}}</div>
        
        <draggable 
          :group="{ name: 'ui-component', pull: 'clone', put: false }" 
          :value="list"
          chosenClass="clst-chosen" 
          ghostClass='clst-ghost' 
          @start='start'
        >
          <span class='component' 
            v-for="(e, idx) in list" 
            :key='idx'
            :id.prop='e.id'
          >{{e.txt}}</span>
        </draggable>
      </div>
      
    </a-collapse-panel>
    
  </a-collapse>
</template>

<script>
const clib = require("./component-library.js");

loadLib('基础组件', './basic.js');

export default {
  data() {
    let data = {
      sname: '$codeless__defaultActiveComponentIndex',
      libs: clib.getLibrary(),
    };
    return data;
  },
  
  computed: {
    acted : {
      get() {
        return localStorage[this.sname];
      },
      set(i) {
        localStorage[this.sname] = i;
      },
    },
  },
  
  methods : {
    start() {
      this.$store.commit('closeDropTip');
    },
    
    onChange(key) {
      this.acted = key;
    },
  },
}


function loadLib(name, path) {
  require(path, 1).then(function(list) {
    clib.loadLib(name, list);
  });
}
</script>

<style scoped>
.component {
  display: inline-block; padding: 3px 10px; border: 1px dashed #ccc; margin: 3px 2px; cursor: move;
  width: calc(50% - 4px);
}
.component:hover {
  border-color: blue;
}
.clst-chosen {
  border: 1px solid #13bc13 !important; background-color: antiquewhite;
}
.clst-ghost {
  color: #fff; background-color: #000;
}
</style>