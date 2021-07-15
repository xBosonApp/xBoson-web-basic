<!-- Create By xBoson System -->

<template>
  <div>
    <div>{{desc}}</div>
    <component :is='componentName' 
      v-bind='bind' 
      v-model='props[name]' 
      @change='onChange'
    />
  </div>
</template>

<script>
const clib = require("./component-library.js");

export default {
  props: ['name', 'desc', 'componentName', 'bind', 'props', 'propsConfig', 'cid'],
  
  mounted() {
    this.mountPlugin();
  },
  
  methods: {
    onChange() {
      this.$emit('change');
    },
    
    mountPlugin() {
      clib.makeComponentPluginLoader(this.cid, this.$options.components);
      this.$forceUpdate();
    },
  },
}
</script>

<style scoped>
</style>