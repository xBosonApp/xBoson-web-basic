<!-- Create By xBoson System -->

<template>
  <dv-full-screen-container>
    <rowrow>
      <center><h3>机电运维管理台</h3></center>
      
      <rowcol style='flex:3'>
        <colcol style='flex:2'>
          <colrow>
            <dv-border-box-5 class='x'>
              <p>10 件</p>
              <p>同比 81</p>
              <p>环比 3</p>
            </dv-border-box-5>
            <div class='r a'>
              <div>运维人均工作量</div>
              <dv-decoration-1 style="width:300px;height:50px;" />
            </div>
          </colrow>
          
          <colrow class='lp'>
            <div style='padding: 10px 0 15px 0;'
              <div>当月维修任务量</div>
              <dv-decoration-1 style="width:300px;height:50px;" />
            </div>
            <dv-border-box-5 :reverse="true" class='x'>
              <p>10 件</p>
              <p>同比 81</p>
              <p>环比 3</p>
            </dv-border-box-5>
          </colrow>
        </colcol>
        
        <colcol style='flex:3'>
          <colrow class='lp'><dv-border-box-9>
            <div>设备完好月趋势</div>
            <dv-decoration-1 style="width:300px;height:50px;" />
            <v-chart :option="d1()" autoresize theme='dark' style='height: 80%'/>
          </dv-border-box-9></colrow>
          
          <colrow class='lp'><dv-border-box-9>
            <div>设备故障月趋势</div>
            <dv-decoration-1 style="width:300px;height:50px;" />
            <v-chart :option="d1()" autoresize theme='dark' style='height: 80%'/>
          </dv-border-box-9></colrow>
        </colcol>
      </rowcol>
      
      <rowcol style='flex:5; margin-top: 20px'>
        <colrow>
          <dv-border-box-10>
          <h4>机电设备完好率</h4>
          <h4>99.1%</h4>
          <v-chart :option="d2()" autoresize theme='dark' style='height: 80%'/>
          </dv-border-box-10>
        </colrow>
        
        <colrow class='lp'>
          <dv-border-box-10>
          <h4>任务维修平均用时</h4>
          <h4>99.1 小时</h4>
          <v-chart :option="d3()" autoresize theme='dark' style='height: 80%'/>
          </dv-border-box-10>
        </colrow>
        
        <colrow class='lp'>
          <dv-border-box-12>
            <h4>人员贡献排行榜</h4>
            <dv-scroll-board :config="list()" style='height: 90%'/>
          </dv-border-box-12>
        </colrow>
        
        <colrow class='lp'>
          <dv-border-box-12>
            <h4>设备故障排行榜</h4>
            <dv-scroll-board :config="list()" style='height: 90%'/>
          </dv-border-box-12>
        </colrow>
        
        <colrow class='lp'>
          <dv-border-box-12>
            <h4>常见故障排行榜</h4>
            <dv-scroll-board :config="list()" style='height: 90%'/>
          </dv-border-box-12>
        </colrow>
      </rowcol>
    </rowrow>
  </dv-full-screen-container>
</template>

<script>
function d1() {
  let source = [];
  for (let i=0; i<20; ++i) {
    source.push([i, parseInt(Math.random() * 100)]);
  }
  return {
    dataset: [{
        source,
    }],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    xAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
        name: 'scatter',
        type: 'scatter',
        datasetIndex: 0
    }]
  }
}

function list() {
  return {
    data: [
      ['行1列1', '行1列2', '行1列3'],
      ['行2列1', '行2列2', '行2列3'],
      ['行3列1', '行3列2', '行3列3'],
      ['行4列1', '行4列2', '行4列3'],
      ['行5列1', '行5列2', '行5列3'],
      ['行6列1', '行6列2', '行6列3'],
      ['行7列1', '行7列2', '行7列3'],
      ['行8列1', '行8列2', '行8列3'],
      ['行9列1', '行9列2', '行9列3'],
      ['行10列1', '行10列2', '行10列3'],
      ['行1列1', '行1列2', '行1列3'],
      ['行2列1', '行2列2', '行2列3'],
      ['行3列1', '行3列2', '行3列3'],
      ['行4列1', '行4列2', '行4列3'],
      ['行5列1', '行5列2', '行5列3'],
      ['行6列1', '行6列2', '行6列3'],
      ['行7列1', '行7列2', '行7列3'],
      ['行8列1', '行8列2', '行8列3'],
      ['行9列1', '行9列2', '行9列3'],
      ['行10列1', '行10列2', '行10列3']
    ]
  }
}

function d2() {
  return {
    angleAxis: {
        type: 'category',
        data: ['其他', '供电系统', '通信系统', '监控系统', '收费系统']
    },
    radiusAxis: {
    },
    polar: {
    },
    series: [{
        type: 'bar',
        data: [1, 2, 3, 4, 3, 5, 1],
        coordinateSystem: 'polar',
        name: 'A',
        stack: 'a',
        emphasis: {
            focus: 'series'
        }
    }],
    legend: {
        show: true,
        data: ['A', 'B', 'C']
    }
  };
}

function d3() {
  return {
    series: [{
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
            show: false
        },
        progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
                borderWidth: 1,
                borderColor: '#464646'
            }
        },
        axisLine: {

            lineStyle: {
                width: 40
            }
        },
        splitLine: {
            show: false,
            distance: 0,
            length: 10
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false,
            distance: 50
        },
        data: [{
            value: 20,
            name: '8小时内',
            title: {
                offsetCenter: ['0%', '-30%']
            },
            detail: {
                offsetCenter: ['0%', '-20%']
            }
        },
        {
            value: 40,
            name: '24小时内',
            title: {
                offsetCenter: ['0%', '0%']
            },
            detail: {
                offsetCenter: ['0%', '10%']
            }
        },
        {
            value: 60,
            name: '大于72小时',
            title: {
                offsetCenter: ['0%', '30%']
            },
            detail: {
                offsetCenter: ['0%', '40%']
            }
        }
        ],
        title: {
            fontSize: 8
        },
        detail: {
            width: 50,
            height: 8,
            fontSize: 8,
            color: 'auto',
            borderColor: 'auto',
            borderRadius: 20,
            borderWidth: 1,
            formatter: '{value}小时'
        }
    }]
  };
}

export default {
  methods : {
    d1, list, d2, d3,
  }
}
</script>

<style scoped>
.x {
  padding: 30px; font-size: 20px; 
}
.x p {
  color: #fff;
}
.r {
  text-align: right;
}
.a {
  padding: 40px 0;
}
.lp {
  margin-left: 10px;
}
</style>