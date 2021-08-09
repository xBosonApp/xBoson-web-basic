<!-- Create By xBoson System -->

<template>
  <select :value='value' @change='select' class='xvue-form-input'>
    <option v-for='d in options' :value='d.id' :selected='d.sl'>{{ d.name }}</option>
  </select>
</template>

<script>
export default {
  props: ['value', 'dict', 'org'],
  
  mounted() {
    this.update();
  },
  
  data() {
    return {
      options: [],
    };
  },
  
  methods: {
    update() {
      let url = '/app/a297dfacd7a84eab9656675f61750078/ZYAPP_LOGIN/ZYMODULE_LOGIN/getdict';
      let parm = { typecd: this.dict, orgid: this.org };
      this.$xapi(xv.ctx_prefix + url, parm).then(ret=>{
        let arr = ret.result[0] && ret.result[0][this.dict];
        if (arr) {
          this.options = arr;
          this.options.forEach(o=>{
            if (o.id == this.value) {
              o.sl = true;
            }
          });
        } else {
          this.options.push({ id:null, name:'[错误, 接口没有数据]' });
        }
      });
    },
    
    select(ev) {
      this.$emit('input', ev.target.value);
    },
  },
}
</script>

<style scoped>
</style>