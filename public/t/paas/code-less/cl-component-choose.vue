<!-- Create By xBoson System -->

<template>
  <a-collapse class='components' 
    :bordered="false" 
    @change="onChange">
    
    <a-collapse-panel v-for="(c, i) in libs" :key="i" :header="c.title">
      
      <div v-for='(list, gname) in c.group' :key='gname'>
        <div class='cl-classify'>{{ gname }}</div>
        
        <draggable 
          :group="{ name: 'ui-component', pull: 'clone', put: false }" 
          :value="list"
          chosenClass="cl-drag-drop-component-chosen" 
          ghostClass='cl-drag-drop-component-ghost' 
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
const tool = require("./tool.js");

export default {
  data() {
    let data = {
      sname : '$codeless__defaultActiveComponentIndex',
      libs  : clib.getLibrary(),
    };
    return data;
  },
  
  mounted() {
    clib.loadStaticLib('基础组件', './basic.js');  
    clib.loadClassify().catch(this.error);
  },
  
  methods : {
    start() {
      this.$store.commit('closeDropTip');
    },
    
    onChange(key) {
      if (Array.isArray(key)) {
        key.forEach(k=> this.onLibClick(k) );
      } else {
        this.onLibClick(key);
      }
    },
    
    onLibClick(index) {
      let lib = this.libs[index];
      if (lib) {
        // console.log('!!!', lib)
        this.$store.commit('loadComponentsFromLibrary', lib.id);
      }
    },
    
    error(err) {
      xv.popError('组件加载', err);
    },
  },
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
</style>