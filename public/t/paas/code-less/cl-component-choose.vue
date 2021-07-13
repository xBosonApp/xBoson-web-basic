<!-- Create By xBoson System -->

<template>
  <a-collapse class='components' 
    :bordered="false" 
    :defaultActiveKey='acted'
    @change="onChange">
    
    <a-collapse-panel v-for="(c, i) in libs" :key="i" :header="c.title" 
        @click.native='onLibClick(c)'>
      
      <div v-for='(list, gname) in c.group' :key='gname'>
        <div class='cl-classify'>{{gname}}</div>
        
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
  
  mounted() {
    clib.loadStaticLib('基础组件', './basic.js');  
    clib.loadClassify().catch(this.error).then(()=>{
      this.libs = clib.getLibrary();
    });
  },
  
  methods : {
    start() {
      this.$store.commit('closeDropTip');
    },
    
    onChange(key) {
      this.acted = key;
    },
    
    onLibClick(lib) {
      if (! this.$store.state.isComponentLoaded[ lib.id ]) {
        lib.contentLoader().catch(this.error).then(()=>{
          this.$store.commit('theComponentLoaded', lib.id);
        });
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