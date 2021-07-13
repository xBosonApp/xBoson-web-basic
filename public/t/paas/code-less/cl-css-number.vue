<!-- Create By xBoson System -->

<template>
  <a-input-group compact>
    <a-tooltip :title="tip">
      <a-input-number @change="upv" :value='v' style="width: 50%"/>
    </a-tooltip>
    
    <component :is='optionComponentId' :change='upu' :value='u' style="width: 50%">
    </component>
  </a-input-group>
</template>

<script>
const tool = require("./tool.js");
const optionsComponentNames = [
  'cl-css-length-unit-options',
  'cl-css-grid-length-unit-options',
];

export default {
  props: ['value', 'default', 'tip', 'optionComponent'],
  components : tool.makeComponents(optionsComponentNames),
  
  computed: {
    v() {
      let x = this.getValue();
      if (x == 'auto') return 'auto';
      if (x || (!isNaN(x))) {
        return /([0-9]*).*/.exec(x)[1];
      }
      return '';
    },
    
    u() {
      let x = this.getValue();
      if (x == 'auto') return '';
      if (x) {
        return /[0-9]*(.*)/.exec(x)[1] || 'px';
      }
      return 'px';
    },
    
    optionComponentId() {
      return this.optionComponent || optionsComponentNames[0];
    },
  },
  
  methods: {
    getValue() {
      if (this.value || (!isNaN(this.value))) {
        return this.value;
      }
      if (this.default || (!isNaN(this.default))) {
        return this.default;
      }
      return 'auto';
    },
    upv(v) {
      this.send(v, this.u);
    },
    upu(u) {
      this.send(this.v, u);
    },
    send(v, u) {
      let r;
      if (v === 0) {
        r = '0px';
      } else if (!v) {
        r = this.default || 'auto';
      } else {
        r = v + u;
      }
      this.value = r;
      this.$emit('input', r);
      this.$emit('change');
    },
  }
}
</script>

<style>
</style>