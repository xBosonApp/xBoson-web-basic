<!-- Create By xBoson System -->

<template><doc>
  <h2>3D 柱状图</h2>
  
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
const $ = require("./data.js");
//const ecStat = require('cdn/echarts-stat/1.2.0/ecStat.min.js');
//const ecSimpleTransform = require("./data/ecSimpleTransform.min.js", 0, 0, 1)
let option;


// 这里插入数据生成代码
function d1() {
  return $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (data) {
    return option = {
        grid3D: {},
        tooltip: {},
        xAxis3D: {
            type: 'category'
        },
        yAxis3D: {
            type: 'category'
        },
        zAxis3D: {},
        visualMap: {
            max: 1e8,
            dimension: 'Population'
        },
        dataset: {
            dimensions: [
                'Income',
                'Life Expectancy',
                'Population',
                'Country',
                {name: 'Year', type: 'ordinal'}
            ],
            source: data
        },
        series: [
            {
                type: 'bar3D',
                // symbolSize: symbolSize,
                shading: 'lambert',
                encode: {
                    x: 'Year',
                    y: 'Country',
                    z: 'Life Expectancy',
                    tooltip: [0, 1, 2, 3, 4]
                }
            }
        ]
    };

    myChart.setOption(option);
});
}

function d2() {
  var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
var days = ['Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],
[6,22,2],[6,23,6]];
return option = {
    tooltip: {},
    visualMap: {
        max: 20,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {
        type: 'category',
        data: hours
    },
    yAxis3D: {
        type: 'category',
        data: days
    },
    zAxis3D: {
        type: 'value'
    },
    grid3D: {
        boxWidth: 200,
        boxDepth: 80,
        viewControl: {
            // projection: 'orthographic'
        },
        light: {
            main: {
                intensity: 1.2,
                shadow: true
            },
            ambient: {
                intensity: 0.3
            }
        }
    },
    series: [{
        type: 'bar3D',
        data: data.map(function (item) {
            return {
                value: [item[1], item[0], item[2]],
            }
        }),
        shading: 'lambert',

        label: {
            fontSize: 16,
            borderWidth: 1
        },

        emphasis: {
            label: {
                fontSize: 20,
                color: '#900'
            },
            itemStyle: {
                color: '#900'
            }
        }
    }]
}
}

function d3() {
  var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
var days = ['Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],
[6,20,1],[6,21,2],[6,22,2],[6,23,6]];
return option = {
    tooltip: {},
    visualMap: {
        max: 20,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {
        type: 'category',
        data: hours
    },
    yAxis3D: {
        type: 'category',
        data: days
    },
    zAxis3D: {
        type: 'value'
    },
    grid3D: {
        boxWidth: 200,
        boxDepth: 80,
        light: {
            main: {
                intensity: 1.2
            },
            ambient: {
                intensity: 0.3
            }
        }
    },
    series: [{
        type: 'bar3D',
        data: data.map(function (item) {
            return {
                value: [item[1], item[0], item[2]]
            }
        }),
        shading: 'color',

        label: {
            show: false,
            fontSize: 16,
            borderWidth: 1
        },

        itemStyle: {
            opacity: 0.4
        },

        emphasis: {
            label: {
                fontSize: 20,
                color: '#900'
            },
            itemStyle: {
                color: '#900'
            }
        }
    }]
}
}

function d4() {
  return $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (data) {

    var sizeValue = '57%';
    var symbolSize = 2.5;

    option = {
        tooltip: {},
        grid3D: {
            width: '50%'
        },
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        grid: [
            {left: '50%', width: '20%', bottom: sizeValue},
            {left: '75%', width: '20%', bottom: sizeValue},
            {left: '50%', width: '20%',  top: sizeValue},
            {left: '75%', width: '20%', top: sizeValue}
        ],
        xAxis: [
            {type: 'value', gridIndex: 0, name: 'Income', axisLabel: {rotate: 50, interval: 0}},
            {type: 'category', gridIndex: 1, name: 'Country', boundaryGap: false, axisLabel: {rotate: 50, interval: 0}},
            {type: 'value', gridIndex: 2, name: 'Income', axisLabel: {rotate: 50, interval: 0}},
            {type: 'value', gridIndex: 3, name: 'Life Expectancy', axisLabel: {rotate: 50, interval: 0}}
        ],
        yAxis: [
            {type: 'value', gridIndex: 0, name: 'Life Expectancy'},
            {type: 'value', gridIndex: 1, name: 'Income'},
            {type: 'value', gridIndex: 2, name: 'Population'},
            {type: 'value', gridIndex: 3, name: 'Population'}
        ],
        dataset: {
            dimensions: [
                'Income',
                'Life Expectancy',
                'Population',
                'Country',
                {name: 'Year', type: 'ordinal'}
            ],
            source: data
        },
        series: [
            {
                type: 'scatter3D',
                symbolSize: 3,
                encode: {
                    x: 'Population',
                    y: 'Life Expectancy',
                    z: 'Income',
                    tooltip: [0, 1, 2, 3, 4]
                }
            },

            {
                type: 'scatter',
                symbolSize: symbolSize,
                xAxisIndex: 0,
                yAxisIndex: 0,
                encode: {
                    x: 'Income',
                    y: 'Life Expectancy',
                    tooltip: [0, 1, 2, 3, 4]
                }
            },
            {
                type: 'scatter',
                symbolSize: symbolSize,
                xAxisIndex: 1,
                yAxisIndex: 1,
                encode: {
                    x: 'Country',
                    y: 'Income',
                    tooltip: [0, 1, 2, 3, 4]
                }
            },
            {
                type: 'scatter',
                symbolSize: symbolSize,
                xAxisIndex: 2,
                yAxisIndex: 2,
                encode: {
                    x: 'Income',
                    y: 'Population',
                    tooltip: [0, 1, 2, 3, 4]
                }
            },
            {
                type: 'scatter',
                symbolSize: symbolSize,
                xAxisIndex: 3,
                yAxisIndex: 3,
                encode: {
                    x: 'Life Expectancy',
                    y: 'Population',
                    tooltip: [0, 1, 2, 3, 4]
                }
            }
        ]
    };

    return myChart.setOption(option);
});
}

function d5() {
  var indices = {
    name: 0,
    group: 1,
    id: 16
};
var schema = [
    {name: 'name', index: 0},
    {name: 'group', index: 1},
    {name: 'protein', index: 2},
    {name: 'calcium', index: 3},
    {name: 'sodium', index: 4},
    {name: 'fiber', index: 5},
    {name: 'vitaminc', index: 6},
    {name: 'potassium', index: 7},
    {name: 'carbohydrate', index: 8},
    {name: 'sugars', index: 9},
    {name: 'fat', index: 10},
    {name: 'water', index: 11},
    {name: 'calories', index: 12},
    {name: 'saturated', index: 13},
    {name: 'monounsat', index: 14},
    {name: 'polyunsat', index: 15},
    {name: 'id', index: 16}
];
var data;

var fieldIndices = schema.reduce(function (obj, item) {
    obj[item.name] = item.index;
    return obj;
}, {});

var groupCategories = [];
var groupColors = [];
var data;
var fieldNames = schema.map(function (item) {
    return item.name;
});
fieldNames = fieldNames.slice(2, fieldNames.length - 2);

function getMaxOnExtent(data) {
    var colorMax = -Infinity;
    var symbolSizeMax = -Infinity;
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var colorVal = item[fieldIndices[config.color]];
        var symbolSizeVal = item[fieldIndices[config.symbolSize]];
        colorMax = Math.max(colorVal, colorMax);
        symbolSizeMax = Math.max(symbolSizeVal, symbolSizeMax);
    }
    return {
        color: colorMax,
        symbolSize: symbolSizeMax
    };
}
var app = {};
var config = app.config = {
    xAxis3D: 'protein',
    yAxis3D: 'fiber',
    zAxis3D: 'sodium',
    color: 'fiber',
    symbolSize: 'vitaminc',

    onChange: function () {
        var max = getMaxOnExtent(data);
        if (data) {
            myChart.setOption({
                visualMap: [{
                    max: max.color / 2
                }, {
                    max: max.symbolSize / 2
                }],
                xAxis3D: {
                    name: config.xAxis3D
                },
                yAxis3D: {
                    name: config.yAxis3D
                },
                zAxis3D: {
                    name: config.zAxis3D
                },
                series: {
                    dimensions: [
                        config.xAxis3D,
                        config.yAxis3D,
                        config.yAxis3D,
                        config.color,
                        config.symbolSiz
                    ],
                    data: data.map(function (item, idx) {
                        return [
                            item[fieldIndices[config.xAxis3D]],
                            item[fieldIndices[config.yAxis3D]],
                            item[fieldIndices[config.zAxis3D]],
                            item[fieldIndices[config.color]],
                            item[fieldIndices[config.symbolSize]],
                            idx
                        ];
                    })
                }
            });
        }
    }
};
app.configParameters = {};
['xAxis3D', 'yAxis3D', 'zAxis3D', 'color', 'symbolSize'].forEach(function (fieldName) {
    app.configParameters[fieldName] = {
        options: fieldNames
    };
});

return $.getJSON(ROOT_PATH + '/data/asset/data/nutrients.json', function (_data) {
    data = _data;

    var max = getMaxOnExtent(data);
    return myChart.setOption({
        tooltip: {},
        visualMap: [{
            top: 10,
            calculable: true,
            dimension: 3,
            max: max.color / 2,
            inRange: {
                color: ['#1710c0', '#0b9df0', '#00fea8', '#00ff0d', '#f5f811', '#f09a09', '#fe0300']
            },
            textStyle: {
                color: '#fff'
            }
        }, {
            bottom: 10,
            calculable: true,
            dimension: 4,
            max: max.symbolSize / 2,
            inRange: {
                symbolSize: [10, 40]
            },
            textStyle: {
                color: '#fff'
            }
        }],
        xAxis3D: {
            name: config.xAxis3D,
            type: 'value'
        },
        yAxis3D: {
            name: config.yAxis3D,
            type: 'value'
        },
        zAxis3D: {
            name: config.zAxis3D,
            type: 'value'
        },
        grid3D: {
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisPointer: {
                lineStyle: {
                    color: '#ffbd67'
                }
            },
            viewControl: {
                // autoRotate: true
                // projection: 'orthographic'
            }
        },
        series: [{
            type: 'scatter3D',
            dimensions: [
                config.xAxis3D,
                config.yAxis3D,
                config.yAxis3D,
                config.color,
                config.symbolSiz
            ],
            data: data.map(function (item, idx) {
                return [
                    item[fieldIndices[config.xAxis3D]],
                    item[fieldIndices[config.yAxis3D]],
                    item[fieldIndices[config.zAxis3D]],
                    item[fieldIndices[config.color]],
                    item[fieldIndices[config.symbolSize]],
                    idx
                ];
            }),
            symbolSize: 12,
            // symbol: 'triangle',
            itemStyle: {
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.8)'
            },
            emphasis: {
                itemStyle: {
                    color: '#fff'
                }
            }
        }]
    });
});
}


let options = [
  d1, d2, d3, d4, d5,
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