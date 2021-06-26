<!-- Create By xBoson System -->

<template>
  <a-popover title="选择颜色" trigger="click">
    <template slot="content">
      <chrome-picker :value='val' @input='up2'/>
    </template>
    <a-input :value='value' @change="up1" placeholder="color">
      <div slot="addonAfter" 
        :style="{ 'background-color': value, 'height':'1.5em', 'width':'80px' }"></div>
    </a-input>
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
      this.$emit('change');
    },
    
    up2(r) {
      let v = r.hex;
      this.value = v;
      this.$emit('input', v);
      this.$emit('change');
    },
  },
}
</script>

<style scoped>
.vc-chrome {
  box-shadow: 0 0 0;
}
</style>