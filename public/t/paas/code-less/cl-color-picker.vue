<!-- Create By xBoson System -->

<template>
  <a-popover title="选择颜色">
    <template slot="content">
      <chrome-picker :value='val' @input='up2'/>
    </template>
    <a-input :value='value' @change="up1" placeholder="color"/>
  </a-popover>
</template>

<script>
export default {
  props: ['value', 'default'],
  
  computed: {
    val() {
      return this.value || this.default || 'auto';
    }
  },
  
  methods: {
    up1(e) {
      let v = e.srcElement.value;
      this.value = v;
      this.$emit('input', v);
    },
    
    up2(r) {
      let v = r.hex;
      this.value = v;
      this.$emit('input', v);
    },
  },
}
</script>

<style scoped>
.vc-chrome {
  box-shadow: 0 0 0;
}
</style>