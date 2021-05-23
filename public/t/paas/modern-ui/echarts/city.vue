<!-- Create By xBoson System -->

<template><doc>
  <h2>城市</h2>
  
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
  return $.getJSON(ROOT_PATH + 'buildings.json', function (buildingsGeoJSON) {

    echarts.registerMap('buildings', buildingsGeoJSON);

    var regions = buildingsGeoJSON.features.map(function (feature) {
        return {
            name: feature.properties.name,
            value: Math.random(),
            height: feature.properties.height / 10
        };
    });


    return myChart.setOption({
        visualMap: {
            show: false,
            min: 0.4,
            max: 1,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
        series: [{
            type: 'map3D',
            map: 'buildings',
            shading: 'realistic',
            environment: '#000',
            realisticMaterial: {
                roughness: 0.6,
                textureTiling: 20
            },
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    intensity: 1.3,
                    radius: 5
                },
                screenSpaceReflection: {
                    enable:false
                },
                depthOfField: {
                    enable: true,
                    blurRadius: 4,
                    focalDistance: 30
                }
            },
            light: {
                main: {
                    intensity: 3,
                    alpha: 40,
                    shadow: true,
                    shadowQuality: 'high'
                },
                ambient: {
                    intensity: 0.
                },
                ambientCubemap: {
                    // texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
                    exposure: 1,
                    diffuseIntensity: 0.5,
                    specularIntensity: 1
                }
            },
            groundPlane: {
                show: false,
                color: '#333'
            },
            viewControl: {
                minBeta: -360,
                maxBeta: 360,
                alpha: 50,
                center: [50, 0, -10],
                distance: 30,
                minDistance: 5,

                panMouseButton: 'left',
                rotateMouseButton: 'middle',
                zoomSensitivity: 0.5
            },

            itemStyle: {
                areaColor: '#666'
                // borderColor: '#222',
                // borderWidth: 1
            },

            label: {
                color: 'white'
            },

            silent: true,

            instancing: true,

            boxWidth: 200,
            boxHeight: 1,

            data: regions
        }]
    });

});
}


let options = [
  d1,
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