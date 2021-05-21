<!-- Create By xBoson System -->

<template><doc>
  <h2>Drawer 抽屉</h2>
  <demo :x='x'><a v-pre><template>
  <div>
    <a-button type="primary" >
      Open
    </a-button>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>
</a></demo>
  
  <h3>自定义位置</h3>
  <demo :x='x'><a v-pre><template>
  <div>
    <a-radio-group style="margin-right: 8px" :default-value="placement" >
      <a-radio value="top">
        top
      </a-radio>
      <a-radio value="right">
        right
      </a-radio>
      <a-radio value="bottom">
        bottom
      </a-radio>
      <a-radio value="left">
        left
      </a-radio>
    </a-radio-group>
    <a-button type="primary" >
      Open
    </a-button>
    <a-drawer
      title="Basic Drawer"
      :placement="placement"
      :closable="false"
      :visible="visible"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>
</a></demo>
  
  <h3></h3>
  <demo :x='x'><a v-pre></a></demo>
  
  <h3></h3>
  <demo :x='x'><a v-pre></a></demo>
  
  <h3></h3>
  <demo :x='x'><a v-pre></a></demo>
  
  <h3></h3>
  <demo :x='x'><a v-pre></a></demo>
  
</doc></template>

<script>
let x = {
  data() {
    return {
      placement: 'left',
      visible: false,
    };
  },
  methods: {
    afterVisibleChange(val) {
      console.log('visible', val);
    },
    showDrawer() {
      this.visible = true;
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    onChange(e) {
      this.placement = e.target.value;
    },
  },
};
export default {
  data() {
    return {x}
  }
}
</script>

<style>
</style>