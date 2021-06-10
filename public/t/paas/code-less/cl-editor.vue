<!-- Create By xBoson System -->

<template>
  <div class="card-container">
    <a-tabs type="card">
      <a-tab-pane key="1" tab="Tab Title 1" :closable='close'>
        <cl-editor-component></cl-editor-component>
      </a-tab-pane>
      
      <a-tab-pane key="2" tab="Tab Title 2">
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab Title 3">
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      close : true,
    }
  }
}
</script>

<style>
.card-container {
  overflow: hidden;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff; 
  padding: 10px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
  /*background: #f5f5f5;*/
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent; border: 0 !important;
  background: transparent; 
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>