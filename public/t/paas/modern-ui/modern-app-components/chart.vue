<!-- Create By xBoson System -->

<template>
  <div>
    <h3>{{title()}}</h3>
    
    <div class='code-block'>
      <v-chart :option="option" autoresize theme='dark' class='indentation'/>
      
      <pre class='preview-code indentation' v-show='showCode'>
        <code class='hljs' v-html='format_source()'></code>
      </pre>
      <center class='indentation'>
        <el-button @click='showCode = !showCode'>{{ showCode ? '隐藏源代码':'显示源代码'}}</el-button>
        <copy :text='source()'/>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  props: ['option'],
  
  data() {
    return {
      showCode : false,
    }
  },
  
  methods : {
    source() {
      return [
        '<template>\n',
        '  <v-chart :option="option"/>\n',
        '</template>\n<script>\n',
        'let option = ', JSON.stringify(this.option, 0, 2), '\n',
        'export default {\n',
        '  data() { return {option}; }\n',
        '}\n',
        '<', '/script>',
        ].join('');
    },
    
    format_source() {
      let fmt = hljs.highlight('html', this.source());
      return fmt.value;
    },
    
    title() {
      let t = this.option.title;
      if (t) {
        if (typeof t == 'string') {
          return t;
        }
        if (typeof t == 'object') {
          if (t.text) return t.text;
          if (t.length > 0) {
            return t[0].text;
          }
        }
      }
      return '图表';
    }
  }
}
</script>
</script>

<style scoped>
.code-block {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
.indentation {
  padding: 20px;
}
</style>