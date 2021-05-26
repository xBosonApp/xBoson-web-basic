<!-- Create By xBoson System -->

<template>
  <dv-full-screen-container>
    <el-row style='flex:1' type='flex' gutter='20'>
      <el-col :span="6" style='flex:1'>
        <el-row style='flex:1; flex-flow: column; height: 100%' type='flex' gutter='20'>
          <dv-border-box-1>
            <div class='content'>
              <h4>紧急报警</h4>  
              <dv-scroll-board :config="d1" style="width:100%;height:100%;" />
            </div>
          </dv-border-box-1>
          
          <dv-border-box-1>
            <div class='content'>
              <h4>故障统计</h4>
              <bs3 title='分级别' class='sm_cht' :option='d2'/>
              <bs3 title='分专业' class='sm_cht' :option='d3'/>
              <bs3 title='分来源' class='sm_cht' :option='d4'/>
              <bs3 title='分路线' class='sm_cht' :option='d5'/>
            </div>
          </dv-border-box-1>
          
          <dv-border-box-1>
            <div class='content'>
              <h4>报表统计</h4>
              <bs4 :option='d6'/>
            </div>
          </dv-border-box-1>
        </el-row> 
      </el-col>
      
      <el-col :span="12">
        <el-row style='flex:1; flex-flow: column; height: 100%' type='flex' gutter='20'>
          <div class='content'>
            <v-chart :option="d11" autoresize theme='dark'/>
          </div>
        </el-row>
      </el-col>
      
      <el-col :span="6">
        <el-row style='flex:1; flex-flow: column; height: 100%' type='flex' gutter='20'>
          <dv-border-box-1><div class='content'>
            <h4>工单施工地点统计</h4>
            <bs4 :option='d8'/>
          </div></dv-border-box-1>
          
          <dv-border-box-1><div class='content'>
            <h4>设备健康统计</h4>
            <bs4 :option='d7'/>
          </div></dv-border-box-1>
          
          <dv-border-box-1><div class='content'>
            <div class='sm_cht sm_r'>
              <h4>列车故障率</h4>
              <div style='height:100%'>
              <v-chart :option="d9" autoresize theme='dark' style=''/>
              </div>
            </div>
            <div class='sm_cht sm_r'>
              <h4>列车在线率</h4>
              <div style='height:100%'>
              <v-chart :option="d10" autoresize theme='dark'/>
              </div>
            </div>
          </div></dv-border-box-1>
          
          <dv-border-box-1><div class='content'>
            <h4>工单完成率统计</h4>
            <bs4 :option='d7'/>
          </div></dv-border-box-1>
        </el-row>
      </el-col>
    </el-row>
  </dv-full-screen-container>
</template>

<script>
let d1 = {
  header: ['级别', '站点', '故障描述', '时间'],
  data: [
    ['1级', '汉中路', '轨电位装置闭锁报警，当前状态为闭锁，预设值为正常', new Date()],
    ['2级', '山西路', '轨电位分闸报警，当前状态为分闸，预设值为合闸', new Date()],
    ['3级', '龙华', '本体通信状态报警，当前状态为通信异常，预设值为正常', new Date()],
    ['4级', '南京西路', '轨电位合闸报警，当前状态为合闸，预设值为分闸', new Date()],
    ['5级', '嘉善路', '本体通信状态报警，当前状态为通信异常，预设值为正常', new Date()],
  ],
  index: true,
  columnWidth: [50],
  align: ['center'],
};

let d2 = {
  radar: {
    indicator: [
      { name: '一级报警'},
      { name: '二级报警' },
      { name: '三级报警' },
      { name: '四级报警' },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [{ value:[2, 11, 22, 88] }],
    }
  ]
};

let d3 = {
  radar: {
    indicator: [
      { name: '通信'},
      { name: '变电' },
      { name: '信号' },
      { name: '接触网' },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [{ value:[2, 11, 22, 88] }],
    }
  ]
};

let d4 = {
  radar: {
    indicator: [
      { name: '交直流'},
      { name: 'EPS' },
      { name: 'UPS' },
      { name: '主变' },
      { name: '降压' },
      { name: '牵引' },
      { name: '运动' },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [{ value:- [2, 11, 22, 88, 33, 22, 1] }],
    }
  ]
};

let d5 = {
  radar: {
    indicator: [
      { name: '1号线'},
      { name: '2号线' },
      { name: '3号线' },
      { name: '4号线' },
      { name: '5号线' },
      { name: '6号线' },
      { name: '7号线' },
      { name: '8号线' },
      { name: '9号线' },
      { name: '10号线' },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [{ value: [2, 11, 22, 88, 33, 22, 1, 4, 12, 45] }],
    }
  ]
};

let d6 = {
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
      itemStyle: {color: '#91c7ae'},
  }]
};

let d7 = {
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
      itemStyle: {color: '#d48265'},
  }]
};

let d8 = {
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
      itemStyle: {color: '#61a0a8'},
  }]
};

let d9= {
      series: [{
        type: 'gauge',
        progress: {
            show: true,
            width: 18
        },
        axisLine: {
            lineStyle: {
                width: 18
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            length: 15,
            lineStyle: {
                width: 2,
                color: '#999'
            }
        },
        axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 10
        },
        anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
                borderWidth: 10
            }
        },
        title: {
            show: false
        },
        detail: {
            valueAnimation: true,
            fontSize: 16,
            offsetCenter: [0, '70%']
        },
        data: [{
            value: 0
        }]
    }]
};

let d10 = {
      series: [{
        type: 'gauge',
        progress: {
            show: true,
            width: 18
        },
        axisLine: {
            lineStyle: {
                width: 18
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            length: 15,
            lineStyle: {
                width: 2,
                color: '#999'
            }
        },
        axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 10
        },
        title: {
            show: false
        },
        detail: {
            valueAnimation: true,
            fontSize: 16,
            offsetCenter: [0, '70%']
        },
        data: [{
            value: 99
        }]
    }]
};

require("./shandong.js");

let d11 = {
    tooltip: {
    },
    geo: {
        // left: 10,
        // right: '50%',
        map: '山东',
        selectedMode: 'multiple',
        emphasis: {
            focus: 'self',
            itemStyle: {
                color: null
            },
            label: {
                position: 'bottom',
                distance: 0,
                textBorderColor: '#fff',
                textBorderWidth: 2
            }
        },
        blur: {
        },
        select: {
            itemStyle: {
                color: '#b50205'
            },
            label: {
                show: false,
                textBorderColor: '#fff',
                textBorderWidth: 2
            }
        }
    },
    grid: {
        left: '60%',
        top: '20%',
        bottom: '20%'
    },
    xAxis: {},
};

export default {
  data() {
    return {d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11};
  }
}
</script>

<style scoped>
h4 {
  border-left: 15px solid red; padding-left: 10px!important;
}
.sm_cht {
  display: inline-block; width: calc(50% - 10px);
}
.sm_r {
  height: 100%;
}
</style>