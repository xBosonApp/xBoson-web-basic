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
export default {
  mounted() {
    let dpre = this.$el.getElementsByTagName('pre')[0];
    let dcode = dpre.firstElementChild.firstElementChild;
    let html = html_beautify(dcode.innerHTML, {indent_size: 2});
    let rcode = hljs.highlight('html', html).value;
    dcode.innerHTML = rcode;
    
    let target = this.$el.getElementsByTagName('target')[0];
    new Vue({
      el : target,
      template : "<div class='indentation'>"+ html +"</div>",
      data() {
        return { x:false, v:true, a:[] }
      }
    });
    this.$forceUpdate();
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