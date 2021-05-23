<!-- Create By xBoson System -->

<template>
  <div>
    <h3>{{title()}}</h3>
    
    <div class='code-block'>
      <div class='chart-panel'>
        <v-chart :option="getOption()" autoresize theme='dark' class='indentation' :loading='loading'/>
      </div>
      
      <pre class='preview-code indentation' v-show='showCode'>
        <code class='hljs' v-html='format_source()'></code>
      </pre>
      <center class='indentation'>
        <el-button @click='showCode = !showCode'>{{ showCode ? '隐藏源代码':'显示源代码'}}</el-button>
        <copy :text='source(true)'/>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  // option 可以是配置对象, 或是一个函数, 返回一个 Promise 异步加载资源
  props: ['option'],
  
  data() {
    return {
      showCode : false,
      loading : false,
    }
  },
  
  methods : {
    getOption() {
      let thiz = this;
      let op = this.option;
      
      if (typeof op === 'function') {
        let rfn = op();
        
        if (rfn.then && rfn.catch) {
          thiz.loading = true;
          rfn.then(function(opt) {
            thiz.loading = false;
            thiz.option = opt;
          }).catch(function(err) {
            popError("chart", err);
          });
          op = thiz.option = {};
        } else if (rfn.series) {
          op = thiz.option = rfn;
        } else {
          throw new Error("Unknow chart data");
        }
      } 
      return op;
    },
    
    source(fullcode) {
      let jsonstr = JSON.stringify(this.option, 0, 2);
      if (!jsonstr) {
        jsonstr = '{}';
      }
      else if ((!fullcode) && jsonstr.length > 10000) {
        jsonstr = '{/* big data */}';
      }
      return [
        '<template>\n',
        '  <v-chart :option="option"/>\n',
        '</template>\n<script>\n',
        'let option = ', jsonstr, '\n',
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
      let op = this.option;
      let t = op.title;
      if (t) {
        if (typeof t == 'string') {
          return t;
        }
        if (typeof t == 'object') {
          if (t.text) return t.text;
          if (t.length > 0) {
            return t[0].text;
          }
          if (t.subtext) return t.subtext;
        }
      }
      if (op.series) {
        if (op.series.type) {
          return op.series.type +' 图';
        }
        if (op.series[0] && op.series[0].type) {
          return op.series[0].type +' 图';
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
.chart-panel {
  height: calc(90vh);
}
</style>