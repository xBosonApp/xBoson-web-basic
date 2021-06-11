<!-- Create By xBoson System -->

<template>
  <a-input-group compact>
    <a-tooltip :title="tip">
      <a-input-number @change="upv" :value='v' style="width: 50%"/>
    </a-tooltip>
    
    <a-select @change='upu' :value='u' style="width: 50%" :dropdownMatchSelectWidth='false'>
      <a-select-opt-group>
        <span slot="label">绝对长度</span>
        <a-select-option value="cm">厘米</a-select-option>
        <a-select-option value="mm">毫米</a-select-option>
        <a-select-option value="in">英寸</a-select-option>
        <a-select-option value="px">像素</a-select-option>
        <a-select-option value="pt">点</a-select-option>
        <a-select-option value="pc">派卡</a-select-option>
      </a-select-opt-group>
      
      <a-select-opt-group>
        <span slot="label">相对长度</span>
        <a-select-option value="em">元素的字体大小</a-select-option>
        <a-select-option value="ex">当前字体的 x-height</a-select-option>
        <a-select-option value="ch"> "0"（零）的宽度</a-select-option>
        <a-select-option value="rem">根元素的字体大小</a-select-option>
        <a-select-option value="vw">视口*宽度的 1%</a-select-option>
        
        <a-select-option value="vh">视口*高度的 1%</a-select-option>
        <a-select-option value="vmin">视口*较小尺寸的 1%</a-select-option>
        <a-select-option value="vmax">视口*较大尺寸的 1％</a-select-option>
        <a-select-option value="%">父元素</a-select-option>
      </a-select-opt-group>
    </a-select>
  </a-input-group>
</template>

<script>
export default {
  props: ['value', 'default', 'tip'],
  
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
      if (!v) {
        r = this.default || 'auto';
      } else {
        r = v + u;
      }
      this.value = r;
      this.$emit('input', r);
    },
  }
}
</script>

<style>
</style>