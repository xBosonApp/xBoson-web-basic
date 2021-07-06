<!-- Create By xBoson System -->

<template>
<div>
  <div class='note'>
    <span>例子:</span>
    <span>{{ optmap[value].demo }}</span>
  </div>

  <a-form-model-item :label='label'>
    <a-select 
      default-value="String" 
      v-model='value'
      :options='options'
      @change='onChange'
    />
  </a-form-model-item>
</div>
</template>

<script>
export default {
  props: ['label', 'value'],
  
  data() {
    const options = [
      { value:'String', label:'字符串', fn:v=>{ 
        return true; 
      }, demo:'abc', def:'' },
      
      { value:'Number', label:'数字', fn:v=>{ 
        if (v === '') return false;
        return !isNaN(v);
      }, demo:'99', def:'0' },
      
      { value:'Array', label:'数组', fn:v=>{
        let a = Function('return '+ v)();
        return Array.isArray(a);
      }, demo:"[1,2,'c']", def:'[]' },
      
      { value:'Object', label:'对象', fn:v=>{
        let a = Function('return '+ v)();
        return typeof a == 'object';
      }, demo:"{ a:1, b:'2', c:{} }", def:'{}' },
      
      { value:'Boolean', label:'布尔', fn:v=>{
        let n = v.toLowerCase();
        return n == 'true' || n == 'false';
      }, demo:"true", def:'false' },
      
      { value:'Date', label:'日期', fn:v=>{
        return !isNaN(new Date(v).getDate());
      }, demo:'2021-6-6 12:00:00', def:new Date().toString() },
    ];
    
    const optmap = {};
    options.forEach((o, i)=>{
      optmap[o.value] = o;
    });
    
    return {
      optmap,
      options,
    };
  },
  
  mounted() {
    this.$emit('getOption', this.opt);
    this.$emit('check', this.check);
  },
  
  methods: {
    onChange(v, e) {
      this.$emit('change', v, e);
      this.$emit('input', v);
    },
    
    opt(t) {
      let s = this.optmap[t];
      if (!s) {
        throw new Error("invaild type "+ t);
      }
      return s;
    },
    
    check(v) {
      let o = this.opt(this.value);
      try {
        return o.fn(v);
      } catch(e) {
        return false;
      }
    },
  },
}
</script>

<style scoped>
</style>