<!-- Create By xBoson System -->

<template>
  <a-input-group compact>
    <cl-css-number v-model='width' style="width: 50%"/>
    <a-select v-model='style' style="width: 25%" :dropdownMatchSelectWidth='false'>
      <a-select-option value="none">无边框</a-select-option>
      <a-select-option value="hidden">隐藏(table)</a-select-option>
      <a-select-option value="dotted">点状</a-select-option>
      <a-select-option value="dashed">虚线</a-select-option>
      <a-select-option value="solid">实线</a-select-option>
      <a-select-option value="double">双线</a-select-option>
      <a-select-option value="groove">凹槽</a-select-option>
      <a-select-option value="ridge">垄状</a-select-option>
      <a-select-option value="inset">内边</a-select-option>
      <a-select-option value="outset">外边</a-select-option>
      <a-select-option value="inherit">继承</a-select-option>
    </a-select>
    <cl-color-picker v-model='color' style='width:25%'/>
  </a-input-group>
</template>

<script>
export default {
  props: ['value'],
  
  computed: {
    width: {
      get() {
        return (this.value && this.value.split(' ')[0]) || '0';
      },
      set(v) {
        this.send(v, this.style, this.color);
      },
    },
    style: {
      get() {
        return (this.value && this.value.split(' ')[1]) || 'none';
      },
      set(v) {
        this.send(this.width, v, this.color);
      },
    },
    color: {
      get() {
        return (this.value && this.value.split(' ')[2]) || '#333333';
      },
      set(v) {
        this.send(this.width, this.style, v);
      },
    },
  },
  
  methods : {
    send(w, s, c) {
      let r = [w, s, c].join(' ');
      this.value = r;
      this.$emit('input', r);
    }
  }
}
</script>

<style>
</style>