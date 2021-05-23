<!-- Create By xBoson System -->

<template><doc>
  <h2>盒须图</h2>
  
  <div v-for='(op, i) in options'>
    <chart :option='op'></chart>
  </div>
  
</doc></template>

<script>
const ROOT_PATH = "";
const $ = require("./data.js");
const ecSimpleTransform = require("./data/ecSimpleTransform.min.js", 0, 0, 1)
//const ecStat = require('cdn/echarts-stat/1.2.0/ecStat.min.js');
let option;


// 这里插入数据生成代码
function d1() {
  return option = {
    title: [
        {
            text: 'Michelson-Morley Experiment',
            left: 'center'
        },
        {
            text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
            borderColor: '#999',
            borderWidth: 1,
            textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                lineHeight: 20
            },
            left: '10%',
            top: '90%'
        }
    ],
    dataset: [{
        source: [
            [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
            [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
            [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
            [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
            [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
        ]
    }, {
        transform: {
            type: 'boxplot',
            config: { itemNameFormatter: 'expr {value}' }
        }
    }, {
        fromDatasetIndex: 1,
        fromTransformResult: 1
    }],
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
            show: false
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        name: 'km/s minus 299,000',
        splitArea: {
            show: true
        }
    },
    series: [
        {
            name: 'boxplot',
            type: 'boxplot',
            datasetIndex: 1
        },
        {
            name: 'outlier',
            type: 'scatter',
            datasetIndex: 2
        }
    ]
};
}

function d2() {
  return option = {
    title: [
        {
            text: 'Michelson-Morley Experiment',
            left: 'center'
        },
        {
            text: 'upper: Q3 + 1.5 * IRQ \nlower: Q1 - 1.5 * IRQ',
            borderColor: '#999',
            borderWidth: 1,
            textStyle: {
                fontSize: 14
            },
            left: '10%',
            top: '90%'
        }
    ],
    dataset: [{
        source: [
            [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
            [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
            [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
            [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
            [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
        ]
    }, {
        transform: {
            type: 'boxplot',
            config: {
                itemNameFormatter: function (params) {
                    return 'expr ' + params.value;
                }
            }
        }
    }, {
        fromDatasetIndex: 1,
        fromTransformResult: 1
    }],
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
    },
    yAxis: {
        type: 'category',
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
            show: false
        },
        splitLine: {
            show: false
        }
    },
    xAxis: {
        type: 'value',
        name: 'km/s minus 299,000',
        splitArea: {
            show: true
        }
    },
    series: [
        {
            name: 'boxplot',
            type: 'boxplot',
            datasetIndex: 1
        },
        {
            name: 'outlier',
            type: 'scatter',
            encode: { x: 1, y: 0 },
            datasetIndex: 2
        }
    ]
};
}

function d3() {
  // Generate data.
function makeData() {
    var data = [];
    for (var i = 0; i < 18; i++) {
        var cate = [];
        for (var j = 0; j < 100; j++) {
            cate.push(Math.random() * 200);
        }
        data.push(cate);
    }
    return data;
}
var data0 = makeData();
var data1 = makeData();
var data2 = makeData();


return option = {
    title: {
        text: 'Multiple Categories',
        left: 'center'
    },
    dataset: [{
        source: data0
    }, {
        source: data1
    }, {
        source: data2
    }, {
        fromDatasetIndex: 0,
        transform: { type: 'boxplot' }
    }, {
        fromDatasetIndex: 1,
        transform: { type: 'boxplot' }
    }, {
        fromDatasetIndex: 2,
        transform: { type: 'boxplot' }
    }],
    legend: {
        top: '10%'
    },
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '10%',
        top: '20%',
        right: '10%',
        bottom: '15%'
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
            show: true
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        name: 'Value',
        min: -400,
        max: 600,
        splitArea: {
            show: false
        }
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 20
    }, {
        show: true,
        type: 'slider',
        top: '90%',
        xAxisIndex: [0],
        start: 0,
        end: 20
    }],
    series: [{
        name: 'category0',
        type: 'boxplot',
        datasetIndex: 3
    }, {
        name: 'category1',
        type: 'boxplot',
        datasetIndex: 4
    }, {
        name: 'category2',
        type: 'boxplot',
        datasetIndex: 5
    }]
};
}

function d4() {
   return $.get(ROOT_PATH + 'life-expectancy-table.json', function run(_rawData) {
  
      echarts.registerTransform(ecSimpleTransform.aggregate);
  
      return  option = {
          dataset: [{
              id: 'raw',
              source: _rawData
          }, {
              id: 'since_year',
              fromDatasetId: 'raw',
              transform: [{
                  type: 'filter',
                  config: {
                      dimension: 'Year', gte: 1950
                  }
              }]
          }, {
              id: 'income_aggregate',
              fromDatasetId: 'since_year',
              transform: [{
                  type: 'ecSimpleTransform:aggregate',
                  config: {
                      resultDimensions: [
                          { name: 'min', from: 'Income', method: 'min' },
                          { name: 'Q1', from: 'Income', method: 'Q1' },
                          { name: 'median', from: 'Income', method: 'median' },
                          { name: 'Q3', from: 'Income', method: 'Q3' },
                          { name: 'max', from: 'Income', method: 'max' },
                          { name: 'Country', from: 'Country' }
                      ],
                      groupBy: 'Country'
                  }
              }, {
                  type: 'sort',
                  config: {
                      dimension: 'Q3',
                      order: 'asc'
                  }
              }]
          }],
          title: {
              text: 'Income since 1950'
          },
          tooltip: {
              trigger: 'axis',
              confine: true
          },
          xAxis: {
              name: 'Income',
              nameLocation: 'middle',
              nameGap: 30,
              scale: true,
          },
          yAxis: {
              type: 'category'
          },
          grid: {
              bottom: 100
          },
          legend: {
              selected: { detail: false }
          },
          dataZoom: [{
              type: 'inside'
          }, {
              type: 'slider',
              height: 20,
          }],
          series: [{
              name: 'boxplot',
              type: 'boxplot',
              datasetId: 'income_aggregate',
              itemStyle: {
                  color: '#b8c5f2'
              },
              encode: {
                  x: ['min', 'Q1', 'median', 'Q3', 'max'],
                  y: 'Country',
                  itemName: ['Country'],
                  tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
              }
          }, {
              name: 'detail',
              type: 'scatter',
              datasetId: 'since_year',
              symbolSize: 6,
              tooltip: {
                  trigger: 'item'
              },
              label: {
                  show: true,
                  position: 'top',
                  align: 'left',
                  verticalAlign: 'middle',
                  rotate: 90,
                  fontSize: 12
              },
              itemStyle: {
                  color: '#d00000'
              },
              encode: {
                  x: 'Income',
                  y: 'Country',
                  label: 'Year',
                  itemName: 'Year',
                  tooltip: ['Country', 'Year', 'Income']
              }
          }]
      };
   });
}


let options = [
  d1(), d2(), d3(), d4,
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