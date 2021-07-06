<!-- Create By xBoson System -->

<template>
  <a-form-model :model="opt">
    <h3><span class='note'>参数: </span> {{ id }}</h3>
    
    <a-form-model-item label="默认值">
      <a-tooltip placement="bottom" title='无效值' :visible='showFail' @blur='checkValue'>
        <a-input v-model="opt.def" type="textarea"/>
      </a-tooltip>
    </a-form-model-item>
    
    <cl-var-types 
      v-model='opt.type'
      :label='值类型'
      @change='change' 
      @check='recvCheck'
    />
    
    <a-form-model-item>
      <a-switch 
        checked-children="必填项" 
        un-checked-children="可选项" 
        default-checked 
        v-model='opt.required'/>
    </a-form-model-item>
    
    <a-button @click='close' type="primary">确定</a-button>
  </a-form-model>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['id', 'opt'],
  
  components : tool.loadc('cl-var-types'),
  
  data() {
    return {
      showFail : false,
      check : null,
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
      if (!this.check) return false;
      let b = this.check(this.opt.def);
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
    
    recvCheck(c) {
      this.check = c;
    },
  },
}
</script>

<style scoped>
h3 {
  border-bottom: 1px dashed #eee;
}
</style>