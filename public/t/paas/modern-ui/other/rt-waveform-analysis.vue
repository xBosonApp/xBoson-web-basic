<!-- Create By xBoson System -->

<template><doc>
  <h2>实时波形数据分析</h2>
  <div>
    <label>基准波形</label>
    <a-radio-group v-model="basename" @change="changeBase(basename)">
      <a-radio-button v-for='(n, i) in names' :value="i" :key='i'>
        {{ n }}
      </a-radio-button>
    </a-radio-group>
  </div>
  
  <div>
    <label>测试波形</label>
    <a-radio-group v-model="testname" @change="changeTest(testname)">
      <a-radio-button v-for='(n, i) in names' :value="i" :key='i'>
        {{ n }}
      </a-radio-button>
    </a-radio-group>
    <a-slider v-model='dt' :step='1' :max='4' :min='1' style='width: 100px; display:inline-block'/>
  </div>
  
  <div style='display: grid; grid-template-columns: auto 1fr; gap: 20px'>
    <div>
      <label>结果</label>
      <a-switch checked-children="自动步进" un-checked-children="手动步进" 
        default-checked v-model='autoStep'/>
      <a-button @click='next' :disabled='autoStep'>步进</a-button>
    </div>
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

var randomdata = [];
for (let i=0; i<dataLen; ++i) {
  randomdata.push(Math.random() * 3000);
}

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
        boundaryGap: [0.1, 0.1],
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
      rand(t) {
        return Math.random() * 1000;
      },
      
      sin(t) {
        return (Math.sin(t/10) * 1000);
      },
      
      sqr(t) {
        let x = funcs.sin(t);
        return x > 0 ? 1000 : 0;
      },
      
      tri(t) {
        let x = 10*1000;
        if (parseInt(t / x) % 2 == 0) {
          return t % x;
        }
        return x - (t % x);
      },
      
      fix(t) {
        console.log(t, t/1000, t/1000 % dataLen)
        return randomdata[parseInt((t/1000) % dataLen)];
      },
    };
    
    return {
      option,
      funcs,
      basename : 'sin',
      testname : 'sin',
      baseFunc : funcs.sin,
      testFunc : funcs.sin,
      dt : 1,
      tid : null,
      p : 0,
      autoStep : true,
      
      names: {
        'rand'  : '完全随机值',
        'sin'   : '正弦波',
        'sqr'   : '方波',
        'tri'   : '三角波',
        'fix'   : '预定随机值',
      },
      
      progressColor: {
        from: '#afaaff',
        to  : '#1890ff',
      },
    }
  },
  
  watch : {
    autoStep(auto) {
      if (auto) {
        if (!this.tid) {
          this.tid = setInterval(this.next, 1000);
        }
      } else {
        clearInterval(this.tid);
        this.tid = null;
      }
    },
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
      testdata.push(this.testFunc(t) * this.dt);
      
      this.allDeviation();
    },
    
    initTime() {
      for (let i=0; i<dataLen; ++i) {
        now = new Date(+now + interval);
        timedata[i] = now.toISOString();
      }
    },
    
    changeBase(name) {
      if (name && this.funcs[name]) {
        this.baseFunc = this.funcs[name];
      }
      
      basedata.length = 0;
      for (let i=0; i<dataLen; ++i) {
        let t = new Date(timedata[i]);
        basedata.push( this.baseFunc(t.getTime()) );
      }
      this.allDeviation();
    },
    
    changeTest(name) {
      if (name && this.funcs[name]) {
        this.testFunc = this.funcs[name];
      }
      
      testdata.length = 0;
      for (let i=0; i<dataLen; ++i) {
        let t = new Date(timedata[i]);
        testdata.push( this.testFunc(t.getTime()) * this.dt );
      }
      this.allDeviation();
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
  /*padding: 20px;*/ margin-top: 15px;
}
.chart-panel {
  height: calc(90vh - 150px);
}
</style>