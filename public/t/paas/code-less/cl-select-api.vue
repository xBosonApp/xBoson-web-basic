<!-- Create By xBoson System -->

<template>
<div>
  <a-input-search
    placeholder="接口"
    enter-button="选择"
    @search="show = true"
    :value='allComponentProps.api'
  />
  
  <a-drawer
    title="API 选择"
    placement="right"
    :visible="show"
    width='80%'
    @close="show = false"
  >
    <x-selector-api
      :org='$store.state.project.orgid'
      @change='onChange'
    />
  </a-drawer>
</div>
</template>

<script>
//
// 这个组件同时设置 4个属性, 另三个属性配置为隐藏状态
//
export default {
  props: ['allComponentProps'],
  
  data() {
    return {
      show : false,
    };
  },
  
  methods: {
    onChange(d) {
      this.allComponentProps.org = d.org;
      this.allComponentProps.app = d.app;
      this.allComponentProps.mod = d.mod;
      this.allComponentProps.api = d.api;
      this.show = false;
      antd.message.success('接口已设置');
      this.$emit('change');
    },
  },
}
</script>

<style scoped>
</style>