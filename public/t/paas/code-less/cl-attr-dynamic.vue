<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <div>{{desc}}</div>
    
    <a-switch v-model='isdyn' size="small" @change='onChange' v-if='!isEventBind'>
      <span slot="checkedChildren">动态</span>
      <span slot="unCheckedChildren">固定</span>
    </a-switch>
    
    <component :is='componentName' 
      v-bind='bind' 
      v-model='props[name]' 
      v-if='!isdyn'
      @change='onChange'
      class='full'
    />
    
    <cl-attr-bind-data
      v-else
      :config='config'
      v-model='props[name]'
      @change='onChange'
      class='full'
    />
  </div>
</template>

<script>
const tool = require("./tool.js");
const clib = require("./component-library.js");
const role = require("./component-role.js");

export default {
  props: ['name', 'desc', 'componentName', 'bind', 'props', 'propsConfig', 'isEventBind', 'cid'],
  
  components: tool.loadc('cl-attr-bind-data', 'cl-attr-dyn-modifiers', 'cl-expr-help', 'cl-select-fa-icon'),
  
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
    
    isdyn: {
      get() {
        if (this.isEventBind) return true;
        return this.config.varType != 'constant';
      },
      set(v) {
        if (this.isEventBind) return;
        if (!v) {
          this.config.varType = 'constant';
        } else {
          this.config.varType = 'expr';
        }
      },
    },
  },
  
  mounted() {
    this.mountPlugin();
  },
  
  data() {
    return {
    };
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
.main {
  display: grid; grid-template-columns: 1fr auto;
}
.full {
  grid-column: 1/3;
}
.tname {
  word-break: keep-all;
}
</style>