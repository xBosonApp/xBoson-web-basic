<!-- Create By xBoson System -->

<template>
  <div style='width:100%; height: 100%'>
    <v-chart :option="option" autoresize theme='dark'/>
  </div>
</template>

<script>
let color = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622'];

let def_option = {
    xAxis: {
        type: 'category',
        data: ['一号线', '二号线', '三号线', '四号线', '五号线', '六号线', '七号线', '八号线', '九号线', '十号线']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150],
        type: 'bar',
        itemStyle: {},
    }]
};

export default {
  props: ['option'],
  data() {
    return { 
      tid:0, 
    };
  },
  
  mounted() {
    let opt = this.option || {};
    for (let n in def_option) {
      if (!opt[n]) {
        opt[n] = def_option[n];
      }
    }
    this.option = opt;
    let thiz = this;
    
    this.tid = setInterval(function (){
        // var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
        var option = thiz.option;
        var data0 = option.series[0].data;
        // var data1 = option.series[1].data;
        // 跑马灯效果
        data0.shift();
        data0.push(Math.random() * 100);
        // data1.shift();
        // data1.push((Math.random() * 10 + 5).toFixed(1) - 0);
    
        let od = option.xAxis.data.shift();
        option.xAxis.data.push(od);
        // option.xAxis[1].data.shift();
        // option.xAxis[1].data.push(app.count++);
    
        thiz.option = option;
    }, 2100);
  },
  
  beforeDestroy() {
    clearInterval(this.tid);
  },
}
</script>

<style>
</style>