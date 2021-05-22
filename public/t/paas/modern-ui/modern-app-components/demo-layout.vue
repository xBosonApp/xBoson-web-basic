<!-- Create By xBoson System -->

<template>
  <div class='code-block'>
    <target></target>
    <pre class='preview-code indentation' v-show='showCode'><code class='hljs'><slot></slot></code></pre>
    <center class='indentation'>
      <el-button @click='showCode = !showCode'>{{ showCode ? '隐藏源代码':'显示源代码'}}</el-button>
    </center>
  </div>
</template>

<script>
let default_data = { 
  x:false, v:true, a:[], s:'string', d:'', i:5,
};

export default {
  
  mounted() {
    let dpre = this.$el.getElementsByTagName('pre')[0];
    let dcode = dpre.firstElementChild.firstElementChild;
    let html = html_beautify(dcode.innerHTML, {indent_size: 2});
    let rcode = hljs.highlight('html', html).value;
    dcode.innerHTML = rcode;
    
    let target = this.$el.getElementsByTagName('target')[0];
    let data = default_data;
    let methods = {};
    
    // 用 x 属性中的值对 data 进行扩展, 在组件上明确 :x='x'
    let x = this.$attrs.x;
    if (x) {
      if (typeof x.data == 'function') {
        merge(data, x.data());
      } else {
        merge(data, x.data);
      }
      merge(methods, x.methods);
    }
    
    new Vue({
      el : target,
      template : "<div class='indentation preview'>"+ html +"</div>",
      data() {
        return data;
      },
      methods,
      computed : x.computed,
    });
    this.$forceUpdate();
    
    
    function merge(a, b) {
      if (b) {
        for (let n in b) {
          a[n] = b[n];
        }
      }
    }
  },
  
  data() {
    return {
      showCode : false,
    }
  }
}
</script>

<style>
.code-block {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.indentation {
  padding: 20px;
}
.preview-code {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #ececec;
}
.preview-code code {
  font-family: Consolas, Monaco, monospace!important;
  font-size: 10pt;
}
</style>