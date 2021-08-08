<!-- Create By xBoson System -->

<script>
export default {
  props: {
    // 接口地址
    url : { type: String, required: true },
    // post 数据
    body : { type: Object },
    // url 参数
    params : { type: Object },
    // 方法: post/get/head/delete/jsonp/put/patch
    method : { type: String },
    // 请求头
    headers : { type: Object },
    // 超时, 默认 5秒
    timeout : { type: Number, default: 5000 },
    // 请求的数据转换为 url 参数格式
    urlencoded : { type: Boolean, default: true },
    // 返回数据类型: text/json/blob
    rtype : { type:String, default:'json' },
    // v-model 绑定返回值
    value : { type: Object },
    // update.sync 绑定更新方法, 调用该方法则发送请求 返回 promise
    update : { type: Object },
    // 在页面渲染后立即请求一次api
    immediately : { type: Boolean, default: true },
  },
  
  mounted() {
    this.$emit('update:update', this.update);
    
    if (this.immediately) {
      this.$nextTick(()=>this.update());
    }
  },
  
  datas() {
    return {
    };
  },
  
  methods: {
    update() {
      let ht = Vue.http;
      if (!ht[this.method]) {
        return fail(new Error('Method '+ this.method +" not found"));
      }
      
      let opt = {
        params      : this.params || {},
        body        : this.body,
        headers     : this.headers,
        timeout     : this.timeout,
        emulateJSON : this.urlencoded,
      };
      
      return ht[this.method](this.url, opt).then(r=>{
        return r[this.rtype]().then(ret=>{
          let data = {
            data        : ret,
            status      : r.status,
            statusText  : r.statusText,
            headers     : r.headers,
          };
          this.$emit('success', data);
          this.$emit('input', data);
          return data;
        });
      }).catch(r=>{
        this.$emit('error', new Error(r.statusText || r.body || 'Unknow Error'));
      });
    },
  },
}
</script>

<style scoped>
</style>