<!-- Create By xBoson System -->

<template>
  <div style='display: grid; grid-template-columns: 1fr; gap: 2px'>
    <a-button v-for='(s, id) in getList()' @click='choose(id)'>{{s.name}}</a-button>
  </div>
</template>

<script>
const tool = require("./tool.js");

export default {
  methods: {
    choose(id) {
      this.$emit('choose', id);
    },
    
    getList() {
      return tool.getRoot().vars;
    },
  },
}
</script>

<style scoped>
</style>