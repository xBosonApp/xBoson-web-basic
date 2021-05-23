<!-- Create By xBoson System -->

<template><doc>
  <h2>其他3d图</h2>
  
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
function d2() {
  // 不显示
  var uploadedDataURL = ROOT_PATH + "flights.json";

myChart.showLoading();

return $.getJSON(uploadedDataURL, function(data) {

    myChart.hideLoading();

    function getAirportCoord(idx) {
        return [data.airports[idx][3], data.airports[idx][4]];
    }
    var routes = data.routes.map(function (airline) {
        return [
            getAirportCoord(airline[1]),
            getAirportCoord(airline[2])
        ];
    });

    return myChart.setOption({
        geo3D: {
            map: 'world',
            shading: 'realistic',
            silent: true,
            environment: '#333',
            realisticMaterial: {
                roughness: 0.8,
                metalness: 0
            },
            postEffect: {
                enable: true
            },
            groundPlane: {
                show: false
            },
            light: {
                main: {
                    intensity: 1,
                    alpha: 30
                },
                ambient: {
                    intensity: 0
                }
            },
            viewControl: {
                distance: 70,
                alpha: 89,

                panMouseButton: 'left',
                rotateMouseButton: 'right'
            },

            itemStyle: {
                color: '#000'
            },

            regionHeight: 0.5
        },
        series: [{
            type: 'lines3D',

            coordinateSystem: 'geo3D',

            effect: {
                show: true,
                trailWidth: 1,
                trailOpacity: 0.5,
                trailLength: 0.2,
                constantSpeed: 5
            },

            blendMode: 'lighter',

            lineStyle: {
                width: 0.2,
                opacity: 0.05
            },

            data: routes
        }]
    });

    // window.addEventListener('keydown', function () {
    //     myChart.dispatchAction({
    //         type: 'lines3DToggleEffect',
    //         seriesIndex: 0
    //     });
    // });
});
}

function d3() {
  var data = [];
// Parametric curve
for (var t = 0; t < 25; t += 0.001) {
    var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
    var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
    var z = t + 2.0 * Math.sin(75 * t);
    data.push([x, y, z]);
}
// console.log(data.length);

return option = {
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: {
        show: false,
        dimension: 2,
        min: 0,
        max: 30,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {
        type: 'value'
    },
    yAxis3D: {
        type: 'value'
    },
    zAxis3D: {
        type: 'value'
    },
    grid3D: {
        viewControl: {
            projection: 'orthographic'
        }
    },
    series: [{
        type: 'line3D',
        data: data,
        lineStyle: {
            width: 4
        }
    }]
};
}

function d4() {
  function createNodes(widthCount, heightCount) {
    var nodes = [];
    for (var i = 0; i < widthCount; i++) {
        for (var j = 0; j < heightCount; j++) {
            nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                value: 1
            });
        }
    }
    return nodes;
}

function createEdges(widthCount, heightCount) {
    var edges = [];
    for (var i = 0; i < widthCount; i++) {
        for (var j = 0; j < heightCount; j++) {
            if (i < widthCount - 1) {
                edges.push({
                    source: i + j * widthCount,
                    target: i + 1 + j * widthCount,
                    value: 1
                });
            }
            if (j < heightCount - 1) {
                edges.push({
                    source: i + j * widthCount,
                    target: i + (j + 1) * widthCount,
                    value: 1
                });
            }
        }
    }
    return edges;
}

var nodes = createNodes(50, 50);
var edges = createEdges(50, 50);

return option = {
    series: [{
        type: 'graphGL',
        nodes: nodes,
        edges: edges,
        itemStyle: {
            color: 'rgba(255,255,255,0.8)'
        },
        lineStyle: {
            color: 'rgba(255,255,255,0.8)',
            width: 3
        },
        forceAtlas2: {
            steps: 5,
            jitterTolerence: 10,
            edgeWeightInfluence: 4
        }
    }]
};
}

// 报错, 依赖baidumap
function d5() {
  return $.getJSON(ROOT_PATH + 'winds.json', function (windData) {

    var data = [];
    var p = 0;
    var maxMag = 0;
    var minMag = Infinity;
    for (var j = 0; j < windData.ny; j++) {
        for (var i = 0; i <= windData.nx; i++) {
            // Continuous data.
            var p = (i % windData.nx) + j * windData.nx;
            var vx = windData.data[p][0];
            var vy = windData.data[p][1];
            var mag = Math.sqrt(vx * vx + vy * vy);
            // 数据是一个一维数组
            // [ [经度, 维度，向量经度方向的值，向量维度方向的值] ]
            data.push([
                i / windData.nx * 360 - 180,
                j / windData.ny * 180 - 90,
                vx,
                vy,
                mag
            ]);
            maxMag = Math.max(mag, maxMag);
            minMag = Math.min(mag, minMag);
        }
    }
    
    return myChart.setOption(option = {
        visualMap: {
            left: 'right',
            min: minMag,
            max: maxMag,
            dimension: 4,
            inRange: {
                // color: ['green', 'yellow', 'red']
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            realtime: false,
            calculable: true,
            textStyle: {
                color: '#fff'
            }
        },
        series: [{
            type: 'flowGL',
            data: data,
            supersampling: 4,
            particleType: 'line',
            particleDensity: 128,
            particleSpeed: 1,
            // gridWidth: windData.nx,
            // gridHeight: windData.ny,
            itemStyle: {
                opacity: 0.7
            }
        }]
    });
});
}



let options = [
  d3, d4,
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