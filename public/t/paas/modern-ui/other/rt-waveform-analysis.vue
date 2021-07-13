<!-- Create By xBoson System -->

<template><doc>
  <h2>实时波形数据分析</h2>
  <div>
    <label>基准波形</label>
  </div>
  
  <div>
    <label>测试波形</label>
  </div>
  
  <div>
    <label>结果</label>
    <a-progress :percent="p" :stroke-color="progressColor"/>
  </div>
  
  <div class='chart-panel'>
    <v-chart :option="option" autoresize theme='dark' class='indentation'/>
  </div>
</doc></template>

<script>
var dataLen = 100;
var basedata = [];
var testdata = [];
var timedata = [];
var deviation = [];
var now = new Date();
var interval = 1000;
var value = 0;

var option = {
    title: {
        text: '波形数据'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        type: 'category',
        splitLine: {
            show: false
        },
        data: timedata,
    },
    yAxis: [{
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: false
        }
    },{
        type: 'value',
        max: 100,
    }],
    series: [
      {
        name: '基准数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: basedata,
      },
      {
        name: '测试数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: testdata,
      },
      {
        name: '误差',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        lineStyle: {
            width: 0
        },
        showSymbol: false,
        label: {
            show: true,
            position: 'top'
        },
        areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(222, 222, 222, 0.8)'
            }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
            }])
        },
        data: deviation,
      }
    ]
};


export default {
  data() {
    let funcs = {
      random(t) {
        return Math.random() * 1000;
      },
      
      sin(t) {
        return (Math.sin(t) * 10000);
      },
    };
    
    return {
      option,
      funcs,
      baseFunc : 'sin',
      testFunc : 'sin',
      tid : null,
      p : 0,
      progressColor: {
        from: '#afaaff',
        to  : '#1890ff',
      },
    }
  },
  
  mounted() {
    this.initTime();
    this.changeBase();
    this.changeTest();
    this.allDeviation();
    this.tid = setInterval(this.next, 1000);
  },
  
  beforeDestroy() {
    clearInterval(this.tid);
  },
  
  methods : {
    next() {
      now = new Date(+now + interval);
      timedata.shift();
      timedata.push(now.toISOString());
      
      let t = now.getTime();
      // basedata.shift();
      // basedata.push(this.funcs[this.baseFunc](t));
      testdata.shift();
      testdata.push(this.funcs[this.testFunc](t));
      
      this.allDeviation();
    },
    
    initTime() {
      for (let i=0; i<dataLen; ++i) {
        now = new Date(+now + interval);
        timedata[i] = now.toISOString();
      }
    },
    
    changeBase() {
      basedata.length = 0;
      for (let i=0; i<dataLen; ++i) {
        let t = new Date(timedata[i]);
        basedata.push( this.funcs[this.baseFunc](t.getTime()) );
      }
    },
    
    changeTest() {
      testdata.length = 0;
      for (let i=0; i<dataLen; ++i) {
        let t = new Date(timedata[i]);
        testdata.push( this.funcs[this.testFunc](t.getTime()) );
      }
    },
    
    allDeviation() {
      let a = 0, b = 0, c = 0;
      
      for (let i=0; i<dataLen; ++i) {
        a += basedata[i] * testdata[i];
        b += basedata[i] * basedata[i];
        c += testdata[i] * testdata[i];
        deviation[i] = Math.max(a / Math.sqrt(b * c), 0) * 100;
      }
      
      this.p = Math.round( Math.max(a / Math.sqrt(b * c), 0) * 100 );
    },
  },
}
</script>

<style scoped>
.indentation {
  padding: 20px;
}
.chart-panel {
  height: calc(90vh - 130px);
}
</style>