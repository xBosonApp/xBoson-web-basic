<!-- Create By xBoson System -->

<template></template>

<script>
// @success(data) - 接口返回成功的数据
// @error(Error) - 借口返回异常的数据
export default {
  props: {
    // 机构id, 应用id, 模块id, api
    org : { type: String, required: true },
    app : { type: String, required: true },
    mod : { type: String, required: true },
    api : { type: String, required: true },
    // 返回异常的时候, 是否弹出异常信息
    showMsg : { type: Boolean, default: true },
    // 参数监听到修改后, 请求 api
    params : { type: Object, default: {} },
    // 在页面渲染后立即请求一次api
    immediately : { type: Boolean, default: true },
    // 如果flag改变, 则立即调用 api
    flag : { type: Object, default: null},
  },
  
  watch : {
    params(v) {
      this.callApi();
    },
    flag() {
      this.callApi();
    },
  },
  
  mounted: function () {
    this.$nextTick(function () {
      if (this.immediately) {
        this.callApi();
      }
    });
  },
  
  methods : {
    error(msg, config) {
      let err = new Error(msg);
      err.url = config.url;
      this.$emit('error', err);
      if (this.showMsg) {
        window.xv.popError('API 返回错误', err);
      }
    },
    
    callApi() {
      let url = [window.xv.ctx_prefix, 'app', this.org, this.app, this.mod, this.api];
      let config = {
        url : url.join('/'),
        params : this.params,
      };
      
      if (window.xv.debug) {
        config.params.s = 'd';
      }
      
      this.$http.get(url.join('/'), config).then(resp => {
        resp.json().then(ret=>{
          if (ret.code) {
            this.error(ret.msg, config);
            return;
          }  
          this.$emit('success', ret);  
        }, e=>{
          this.error(config.url +'\nJSON parse fail');
        });
      }, resp => {
        this.error(config.url +'\n'+ statusText, config);
      });
    },
  }
}
</script>

<style>
</style>