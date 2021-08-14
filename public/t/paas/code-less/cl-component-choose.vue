<!-- Create By xBoson System -->

<template>
  <a-collapse class='components' 
    :bordered="false" 
    @change="onChange">
    
    <a-collapse-panel v-for="(c, i) in libs" :key="i" :header="c.title">
      
      <div v-for='(list, gname) in c.group' :key='gname'>
        <div class='cl-classify'>{{ gname }}</div>
          <span class='component' 
            v-for="(e, idx) in list" 
            :key='idx'
            :id.prop='e.id'
            :draggable.prop="true"
            @dragstart.stop='onDragStart($event, e, idx)'
            @dragend.stop='onDragEnd($event, e, idx)'
          >{{e.txt}}</span>
      </div>
      
    </a-collapse-panel>
    
  </a-collapse>
</template>

<script>
const DPRE = 'component-container-drag-data';
const clib = require("./component-library.js");
const tool = require("./tool.js");

export default {
  data() {
    let data = {
      sname : '$codeless__defaultActiveComponentIndex',
      libs  : clib.getLibrary(),
      clearList : [],
    };
    return data;
  },
  
  created() {
    clib.init().catch(this.error);
  },
  
  methods : {
    onDragStart(ev, node, index) {
      this.$store.commit('closeDropTip');
      let el = ev.target.cloneNode(true);
      let release = ()=>{
        el.remove();
      };
      
      el.id = null;
      el.classList.add('cl-draging');
      this.clearList.push(release);
      // console.log('drag c', el);
      
      let drapData = {
        node, index,
        release,
        list : [], 
        el,
        stop : false,
        dropNode : ()=>{},
      };
      
      let key = tool.saveData(drapData, DPRE);
      ev.dataTransfer.effectAllowed = 'copyMove';
      ev.dataTransfer.setData(key, 'true');
      ev.target.drapData = drapData;
    },
    
    onDragEnd(ev, node, index) {
      // console.log("end c", ev);
      let d = ev.target.drapData;
      if (d) {
        d.dropNode(d);
      } else {
        ev.dataTransfer.dropEffect = 'none';
      }
      
      this.doClear();
      tool.clearData(DPRE);
    },
    
    doClear() {
      while (this.clearList.length > 0) {
        let fn = this.clearList.pop();
        fn();
      }
    },
    
    loadData(dataTransfer) {
      let t = dataTransfer.types;
      for (let i=0; i<t.length; ++i) {
        console.log('ll', i, t[i])
        if (t[i].startsWith(DPRE)) {
          return tool.loadData(t[i]);
        }
      }
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