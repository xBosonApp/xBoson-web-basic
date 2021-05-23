<!-- Create By xBoson System -->

<template><doc>
  <h2>漏斗图</h2>
  
  <div v-for='(op, i) in options'>
    <chart :option='op'></chart>
  </div>
  
</doc></template>

<script>
const ROOT_PATH = "";
const myChart = {
  showLoading(){},
  hideLoading(){},
  setOption(o) { return o; },
};
//const $ = require("./data.js");
//const ecStat = require('cdn/echarts-stat/1.2.0/ecStat.min.js');
//const ecSimpleTransform = require("./data/ecSimpleTransform.min.js", 0, 0, 1)
let option;


// 这里插入数据生成代码
function d1() {
  return option = {
    title: {
        text: '漏斗图',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        data: ['展现','点击','访问','咨询','订单']
    },

    series: [
        {
            name:'漏斗图',
            type:'funnel',
            left: '10%',
            top: 60,
            //x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
                show: true,
                position: 'inside'
            },
            labelLine: {
                length: 10,
                lineStyle: {
                    width: 1,
                    type: 'solid'
                }
            },
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
            },
            emphasis: {
                label: {
                    fontSize: 20
                }
            },
            data: [
                {value: 60, name: '访问'},
                {value: 40, name: '咨询'},
                {value: 20, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        }
    ]
};
}

function d2() {
  return option = {
    title: {
        text: '漏斗图(对比)',
        subtext: '纯属虚构',
        left: 'left',
        top: 'bottom'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        top: 'center',
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['产品A', '产品B', '产品C', '产品D', '产品E']
    },

    series: [
        {
            name: '漏斗图',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '5%',
            top: '50%',
            funnelAlign: 'right',

            center: ['25%', '25%'],  // for pie

            data: [
                {value: 60, name: '产品C'},
                {value: 30, name: '产品D'},
                {value: 10, name: '产品E'},
                {value: 80, name: '产品B'},
                {value: 100, name: '产品A'}
            ]
        },
        {
            name: '金字塔',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '5%',
            top: '5%',
            sort: 'ascending',
            funnelAlign: 'right',

            center: ['25%', '75%'],  // for pie

            data: [
                {value: 60, name: '产品C'},
                {value: 30, name: '产品D'},
                {value: 10, name: '产品E'},
                {value: 80, name: '产品B'},
                {value: 100, name: '产品A'}
            ]
        },
        {
            name: '漏斗图',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '55%',
            top: '5%',
            funnelAlign: 'left',

            center: ['75%', '25%'],  // for pie

            data: [
                {value: 60, name: '产品C'},
                {value: 30, name: '产品D'},
                {value: 10, name: '产品E'},
                {value: 80, name: '产品B'},
                {value: 100, name: '产品A'}
            ]
        },
        {
            name: '金字塔',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '55%',
            top: '50%',
            sort: 'ascending',
            funnelAlign: 'left',

            center: ['75%', '75%'],  // for pie

            data: [
                {value: 60, name: '产品C'},
                {value: 30, name: '产品D'},
                {value: 10, name: '产品E'},
                {value: 80, name: '产品B'},
                {value: 100, name: '产品A'}
            ]
        }
    ]
};
}

function d3() {
  return option = {
    title: {
        text: '漏斗图',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        data: ['展现','点击','访问','咨询','订单']
    },
    series: [
        {
            name: '预期',
            type: 'funnel',
            left: '10%',
            width: '80%',
            label: {
                formatter: '{b}预期'
            },
            labelLine: {
                show: false
            },
            itemStyle: {
                opacity: 0.7
            },
            emphasis: {
                label: {
                    position: 'inside',
                    formatter: '{b}预期: {c}%'
                }
            },
            data: [
                {value: 60, name: '访问'},
                {value: 40, name: '咨询'},
                {value: 20, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        },
        {
            name: '实际',
            type: 'funnel',
            left: '10%',
            width: '80%',
            maxSize: '80%',
            label: {
                position: 'inside',
                formatter: '{c}%',
                color: '#fff'
            },
            itemStyle: {
                opacity: 0.5,
                borderColor: '#fff',
                borderWidth: 2
            },
            emphasis: {
                label: {
                    position: 'inside',
                    formatter: '{b}实际: {c}%'
                }
            },
            data: [
                {value: 30, name: '访问'},
                {value: 10, name: '咨询'},
                {value: 5, name: '订单'},
                {value: 50, name: '点击'},
                {value: 80, name: '展现'}
            ],
            // Ensure outer shape will not be over inner shape when hover.
            z: 100
        }
    ]
};
}

function d4() {
  return option = {
    title: {
        text: '漏斗图',
        subtext: '纯属虚构',
        left: 'left',
        top: 'bottom'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
        orient: 'vertical',
        top: 'center',
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['展现', '点击', '访问', '咨询', '订单']
    },

    series: [
        {
            name: '漏斗图',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '5%',
            top: '50%',
            data: [
                {value: 60, name: '访问'},
                {value: 30, name: '咨询'},
                {value: 10, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        },
        {
            name: '金字塔',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '5%',
            top: '5%',
            sort: 'ascending',
            data: [
                {value: 60, name: '访问'},
                {value: 30, name: '咨询'},
                {value: 10, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        },
        {
            name: '漏斗图',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '55%',
            top: '5%',
            label: {
                position: 'left'
            },
            data: [
                {value: 60, name: '访问'},
                {value: 30, name: '咨询'},
                {value: 10, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        },
        {
            name: '金字塔',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '55%',
            top: '50%',
            sort: 'ascending',
            label: {
                position: 'left'
            },
            data: [
                {value: 60, name: '访问'},
                {value: 30, name: '咨询'},
                {value: 10, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        }
    ]
};
}

let options = [
  d1, d2, d3, d4, 
];

export default {
  data() {
    return {
      options
    };
  }
}
</script>

<style>
</style>