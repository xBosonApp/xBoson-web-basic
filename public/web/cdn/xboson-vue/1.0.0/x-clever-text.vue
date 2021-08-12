<!-- Create By xBoson System -->

<template>
  <v-text-field
    :value='value'
    @input='change'
    :name.prop='name'
    counter
    :maxlength='maxlength'
    :label="label"
    :hint='hint'
    :rules="check"
    clearable
  ></v-text-field>
</template>

<script>
export default {
  props: {
    'value' : Object, 
    'name' : String, 
    'maxlength': Number, 
    'label': {
      type: String,
      default: '标题',
    }, 
    'hint': String, 
    // 可用策略: tel, email, define
    'strategy': String,
    // 自定义验证策略正则表达式字符串
    'checkReg': String,
    'checkMsg': {
      type: String,
      default: '无效',
    },
    'required': Boolean,
  },
  
  data() {
    return {
      strategyFn: {
        tel : this.tel,
        email : this.email,
        define : this.define,
      },
      
      telreg : /^1[3456789]\d{9}$/,
      emailreg : /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
      definereg : new RegExp(this.checkReg),
    };
  },
  
  methods: {
    check() {
      if (!this.value) {
        if (this.required) {
          return "必须填写";  
        }
        return;
      }
      
      let fn = this.strategyFn[this.strategy];
      if (!fn) {
        return "属性 strategy 指向无效的验证策略";
      }
      let ret = fn(this.value);
      if (!ret) {
        this.change();
      }
      return ret;
    },
    
    tel(v) {
      if (!this.telreg.test(v)) {
        return "无效的手机号码格式";
      }
    },
    
    email(v) {
      if (!this.emailreg.test(v)) {
        return "无效的电子邮箱格式";
      }
    },
    
    define(v) {
      if (!this.definereg.test(v)) {
        return this.checkMsg;
      }
    },
    
    change() {
      this.$emit('set', {n: this.name, v:this.value});
    },
  },
}
</script>

<style scoped>
</style>