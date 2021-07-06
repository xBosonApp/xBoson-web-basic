<!-- Create By xBoson System -->

<template>
  <div class='list'>
    <h4 v-if='allowProps || allowComputed'>变量</h4>
    <a-button v-for='(s, id) in getVars()' @click='choose(id, s)'>{{s.name}}</a-button>
    
    <section v-if='allowProps' class='list'>
      <h4>参数属性</h4>
      <a-button v-for='(s, id) in getArgProps()' @click='choose(id, s)'>{{s.name}}</a-button>
    </section>
    
    <section v-if='allowComputed' class='list'>
      <h4>计算属性</h4>
      <a-button v-for='(s, id) in getComputeProps()' @click='choose(id, s)'>{{s.name}}</a-button>
    </section>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props : ['allowProps', 'allowComputed'],
  
  methods: {
    choose(id, cfg) {
      this.$emit('choose', id, cfg);
    },
    
    getVars() {
      return tool.getRoot().vars;
    },
    
    getArgProps() {
      return tool.getRoot().argProps;
    },
    
    getComputeProps() {
      return tool.getRoot().computeProps;
    },
  },
}
</script>

<style scoped>
.list {
  display: grid; grid-template-columns: 1fr; gap: 2px
}
h4 {
  border-bottom: 1px dashed #ccc;
}
section {
  margin-top: 15px;
}
</style>