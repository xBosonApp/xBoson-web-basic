<!-- Create By xBoson System -->

<template>
  <select :value='value' @change='change' class='xvue-form-input'>
    <option v-for='op in options' :value='op.orgid' :selected='op.sl'>{{ op.orgnm }}</option>
  </select>
</template>

<script>
export default {
  props: ['value', 'openid'],
  
  data() {
    return {
      options: [],
    };
  },
  
  mounted() {
    this.update();
  },
  
  methods: {
    update() {
      let url = '/user/getuserorg?app=ZYAPP_LOGIN&mod=ZYMODULE_LOGIN&org=';
      let parm = { openid: this.openid || '' };
      
      this.$xapi(xv.ctx_prefix + url, parm).then(ret=>{
        if (ret.result && ret.result.length > 0) {
          this.options = ret.result;
          this.options.forEach(o=>{
            if (o.orgid == this.value) {
              o.sl = true;
            }
          })
        } else {
          this.options.push({
            orgid: null, orgnm: '[错误: 没有数据]',
          });
        }
      }).catch(this.error);
    },
    
    change(ev) {
      this.$emit('input', ev.target.value);
    },
    
    error(err) {
      xv.popError("机构选择", err);
      this.options.push({
        orgid: null, orgnm: '[错误:'+ err.message +']',
      });
    },
  },
}
</script>

<style scoped>
</style>