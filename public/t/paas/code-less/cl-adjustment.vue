<!-- Create By xBoson System -->

<template>
  <a-tabs>
    
    <a-tab-pane key="1" tab="属性" class='panel'>
      <div v-if='config != null'>
        <cl-adj-attr :config='config'/>
      </div>
      <center v-else class='note'>点击一个组件以编辑属性</center>
    </a-tab-pane>
    
    <a-tab-pane key="2" tab="样式" class=''>
      <div v-if='config != null'>
        <div style='padding: 8px 20px; border-bottom: 1px solid #eee;'>
          <div>
            <span class='note cid'>组件 ID</span> 
            <cl-anim-text :value='config.id'/>
          </div>
          <div class='note'>{{ config.note }}</div>
        </div>
        <cl-bind-context-css :config='config'/>
        <cl-style-adj :styleVal='config.props.style' @change='onChange'></cl-style-adj>
      </div>
      <center v-else class='note'>点击一个组件以编辑属性</center>
    </a-tab-pane>
    
    <a-tab-pane key="3">
      <div slot='tab' class='adv'>高级</div>
      <cl-adj-advanced/>
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
    'cl-anim-text',
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
.panel { padding: 2px 5px; }
center.note { margin-top: 50px; }
.adv { color: brown; }
.cid { margin-right: 10px; }
</style>