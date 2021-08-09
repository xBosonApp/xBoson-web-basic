<!-- Create By xBoson System -->

<template>
<div>
  <a-input-search
    placeholder="字典"
    enter-button="选择"
    @search="show = true"
    :value='value'
  />
  
  <a-drawer
    title="字典选择"
    placement="right"
    width='50%'
    :visible="show"
    :destroyOnClose='true'
    @close="show = false"
  >
    <x-selector-dict
      :org='org'
      :value='value'
      @input='onChange'
    />
  </a-drawer>
</div>
</template>

<script>
export default {
  props: ['value', 'allComponentProps'],
  
  data() {
    return {
      show : false,
      org  : this.$store.state.project.orgid,
    };
  },
  
  mounted() {
    if (!this.allComponentProps.org) {
      this.allComponentProps.org = this.org;
    }
  },
  
  watch: {
    'allComponentProps.org': function(v, o) {
      // console.log('org change', v, o);
      this.org = v;
      this.$emit('input', null);
    },
  },
  
  methods: {
    onChange(v) {
      this.$emit('input', v);
      this.show = false;
      antd.message.success("字典已选择");
    },
  },
}
</script>

<style scoped>
</style>