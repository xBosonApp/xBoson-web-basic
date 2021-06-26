<!-- Create By xBoson System -->

<template>
  <a-tabs type="card">
    
    <a-tab-pane key="1" tab="属性" class='panel'>
      <div v-if='config != null'>
        <cl-adj-attr :config='config'/>
      </div>
      <center v-else class='note'>点击一个组件以编辑属性</center>
    </a-tab-pane>
    
    <a-tab-pane key="2" tab="样式" class=''>
      <div v-if='config != null'>
        <cl-bind-context-css :config='config'/>
        <cl-style-adj :styleVal='config.props.style' @change='onChange'></cl-style-adj>
      </div>
      <center v-else class='note'>点击一个组件以编辑属性</center>
    </a-tab-pane>
    
    <a-tab-pane key="3" tab="高级" class='panel'>
      <cl-adj-advanced/>
    </a-tab-pane>
    
    <a-tab-pane key="4" tab="接口" class='panel'>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
const tool = require("./tool.js");

export default {
  components: tool.makeComponents([
    'cl-adj-attr',
    'cl-adj-advanced',
    'cl-style-adj',
    'cl-bind-context-css',
    ]),
  
  data() {
    return {
    }  
  },
  
  computed: {
    config() {
      return this.$store.state.currentAdjustmentComponentConfig;
    },
  },
  
  methods : {
    onChange() {
      this.$store.commit('setEditFileChanged', true);
    },
  }
}
</script>

<style scoped>
.panel {
  padding: 2px 5px;
}
center.note {
  margin-top: 50px;
}
</style>