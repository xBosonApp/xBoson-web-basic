<!-- Create By xBoson System -->

<template>
  <a-form-model :model="opt">
    <a-form-model-item label="初始值">
      <a-tooltip placement="bottom" title='无效值' :visible='showFail' @blur='checkValue'>
        <a-input v-model="opt.def" type="textarea"/>
      </a-tooltip>
    </a-form-model-item>
    
    <div class='note'>
      <span>例子:</span>
      <span>{{ optmap[opt.type].demo }}</span>
    </div>
    
    <a-form-model-item label='值类型'>
      <a-select 
        default-value="String" 
        v-model='opt.type' 
        :options='options'
        @change='change'/>
    </a-form-model-item>
    <a-button @click='close' type="primary">确定</a-button>
  </a-form-model>
</template>

<script>
export default {
  props: ['id', 'opt'],
  
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
      showFail : false,
      optmap,
      options,
    };
  },
  
  mounted() {
    this.$emit('blockClose', true);
  },
  
  methods: {
    change(v, e) {
      if (!e.data.props.fn(this.opt.def)) {
        this.opt.def = e.data.props.def;
      }
    },
    
    checkValue() {
      let b = this.optmap[this.opt.type].fn( this.opt.def );
      this.showFail = !b;
      this.$emit('blockClose', !b);
      return b;
    },
    
    close() {
      if (this.checkValue()) {
        this.$emit('close');
        this.$emit('change');
      }
    },
  },
}
</script>

<style scoped>
</style>