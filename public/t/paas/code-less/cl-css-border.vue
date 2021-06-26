<!-- Create By xBoson System -->

<template>
  <div class='main'>
    <cl-css-number v-model='width'/>
    <a-select v-model='style' :dropdownMatchSelectWidth='false'>
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
    <cl-color-picker v-model='color' class='c'/>
  </div>
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
      this.$emit('change');
    }
  }
}
</script>

<style scoped>
.main {
  display: grid; gap: 2px; grid-template-columns: 3fr 2fr;
}
.c {
  grid-column: 1/3;
}
</style>