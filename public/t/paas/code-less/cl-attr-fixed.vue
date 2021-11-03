<!-- Create By xBoson System -->

<template>
  <div>
    <div>{{desc}}</div>
    
    <!-- 此处决定传递给自定义插件的参数, 另一处在 cl-attr-dynamic -->
    <component :is='componentName' 
      v-bind='bind' 
      v-model='props[name]' 
      @change='onChange'
      class='full'
      
      :allComponentProps='props'
      :propsConfig='config'
    />
  </div>
</template>

<script>
const tool = require("./tool.js");
const clib = require("./component-library.js");
const role = require("./component-role.js");

export default {
  props: ['name', 'desc', 'componentName', 'bind', 'props', 'propsConfig', 'cid'],
  
  components: tool.loadc('cl-select-fa-icon'),
  
  mounted() {
    this.mountPlugin();
  },
  
  computed: {
    config() {
      if (!this.propsConfig[this.name]) {
        let comp = clib.getComponent(this.cid);
        if (comp) {
          let pc = role.createPropsConfig(this.name, comp);
          this.$set(this.propsConfig, this.name, pc);
          this.$set(this.props, this.name, null);
        } else {
          throw new Error("component not exits, id:"+ this.cid);
        }
      }
      return this.propsConfig[this.name];
    },
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