<!-- Create By xBoson System -->

<template>
  <a-tabs type="card">
    
    <a-tab-pane key="1" tab="属性" class='panel'>
      <div v-if='$store.state.currentAdjustmentComponentConfig != null'>
        <div>文本</div>
        <a-textarea v-model='$store.state.currentAdjustmentComponentConfig.txt'
          placeholder="此处为组件显示文本"
          :auto-size="{ minRows: 2, maxRows: 10 }"/>
      </div>
    </a-tab-pane>
    
    <a-tab-pane key="2" tab="样式" class='panel'>
    </a-tab-pane>
    
    <a-tab-pane key="3" tab="高级" class='panel'>
    </a-tab-pane>
    
    <a-tab-pane key="4" tab="接口" class='panel'>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
}
</script>

<style scoped>
.panel {
  padding: 2px 5px;
}
</style>