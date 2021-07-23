<!-- Create By xBoson System -->

<template>
  <div>
    <div>{{desc}}</div>
    <component :is='componentName' 
      v-bind='bind' 
      v-model='props[name]' 
      @change='onChange'
      class='full'
    />
  </div>
</template>

<script>
const tool = require("./tool.js");
const clib = require("./component-library.js");

export default {
  props: ['name', 'desc', 'componentName', 'bind', 'props', 'propsConfig', 'cid'],
  
  components: tool.loadc('cl-select-fa-icon'),
  
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
.full { width: 100%; }
</style>