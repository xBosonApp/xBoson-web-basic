<!-- Create By xBoson System -->

<template><doc>
  <h2>地理坐标/地图</h2>
  
  <div v-for='(op, i) in options'>
    <chart :option='op'></chart>
  </div>
  
</doc></template>

<script>
const ROOT_PATH = "";
const $ = require("./data.js");
let option;
//const ecStat = require('cdn/echarts-stat/1.2.0/ecStat.min.js');

function d1() {
  return $.get(ROOT_PATH + 'Veins_Medical_Diagram_clip_art.svg', function (svg) {
  
      echarts.registerMap('organ_diagram', {svg: svg});
  
      return option = {
        title: {text:'内脏数据'},
          tooltip: {
          },
          geo: {
              left: 10,
              right: '50%',
              map: 'organ_diagram',
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
          yAxis: {
              data: ['heart', 'large-intestine', 'small-intestine', 'spleen', 'kidney', 'lung', 'liver']
          },
          series: [{
              type: 'bar',
              emphasis: {
                  focus: 'self'
              },
              data: [121, 321, 141, 52, 198, 289, 139]
          }]
      };
  
      myChart.setOption(option);
  
      myChart.on('mouseover', { seriesIndex: 0 }, function (event) {
          myChart.dispatchAction({
              type: 'highlight',
              geoIndex: 0,
              name: event.name
          });
      });
      myChart.on('mouseout', { seriesIndex: 0 }, function (event) {
          myChart.dispatchAction({
              type: 'downplay',
              geoIndex: 0,
              name: event.name
          });
      });
  
  });
}

function d2() {
  return $.get(ROOT_PATH + 'flight-seats.svg', function (svg) {
  
      echarts.registerMap('flight-seats', { svg: svg });
  
      var takenSeatNames = ['26E', '26D', '26C', '25D', '23C', '21A', '20F'];
  
      return option = {
        title: {text:'航班选座'},
          tooltip: {
          },
          geo: {
              map: 'flight-seats',
              roam: true,
              selectedMode: 'multiple',
              layoutCenter: ['50%', '50%'],
              layoutSize: '95%',
              tooltip: {
                  show: true
              },
              itemStyle: {
                  color: '#fff'
              },
              emphasis: {
                  itemStyle: {
                      color: null,
                      borderColor: 'green',
                      borderWidth: 2
                  },
                  label: {
                      show: false
                  }
              },
              select: {
                  itemStyle: {
                      color: 'green'
                  },
                  label: {
                      show: false,
                      textBorderColor: '#fff',
                      textBorderWidth: 2
                  }
              },
              regions: makeTakenRegions(takenSeatNames)
          }
      };
  
      function makeTakenRegions(takenSeatNames) {
          var regions = [];
          for (var i = 0; i < takenSeatNames.length; i++) {
              regions.push({
                  name: takenSeatNames[i],
                  silent: true,
                  itemStyle: {
                      color: '#bf0e08'
                  },
                  emphasis: {
                      itemStyle: {
                          borderColor: '#aaa',
                          borderWidth: 1
                      }
                  },
                  select: {
                      itemStyle: {
                          color: '#bf0e08'
                      }
                  }
              });
          }
          return regions;
      }
  
      myChart.setOption(option);
  
      // Get selected seats.
      myChart.on('geoselectchanged', function (params) {
          var selectedNames = params.allSelected[0].name.slice();
  
          // Remove taken seats.
          for (var i = selectedNames.length - 1; i >= 0; i--) {
              if (takenSeatNames.indexOf(selectedNames[i]) >= 0) {
                  selectedNames.splice(i, 1);
              }
          }
  
          console.log('selected', selectedNames);
      });
  
  });
}

function d3() {
  return $.get(ROOT_PATH + 'MacOdrum-LV5-floorplan-web.svg', function (svg) {

      echarts.registerMap('MacOdrum-LV5-floorplan-web', { svg: svg });
  
      return option = {
          title: {
              text: 'Visit Route',
              left: 'center',
              bottom: 10
          },
          tooltip: {
          },
          geo: {
              map: 'MacOdrum-LV5-floorplan-web',
              roam: true,
              emphasis: {
                  itemStyle: {
                      color: null
                  },
                  label: {
                      show: false
                  }
              }
          },
          series: [{
              name: 'Route',
              type: 'lines',
              coordinateSystem: 'geo',
              geoIndex: 0,
              emphasis: {
                  label: {
                      show: false
                  }
              },
              polyline: true,
              lineStyle: {
                  color: '#c46e54',
                  width: 5,
                  opacity: 1,
                  type: 'dotted'
              },
              effect: {
                  show: true,
                  period: 8,
                  color: '#a10000',
                  constantSpeed: 80,
                  trailLength: 0,
                  symbolSize: [20, 12],
                  symbol: 'path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z'
              },
              data: [{
                  coords: [
                      [110.6189462165178, 456.64349563895087],
                      [124.10988522879458, 450.8570048730469],
                      [123.9272226116071, 389.9520693708147],
                      [61.58708083147317, 386.87942320312504],
                      [61.58708083147317, 72.8954315876116],
                      [258.29514854771196, 72.8954315876116],
                      [260.75457021484374, 336.8559607533482],
                      [280.5277985253906, 410.2406672084263],
                      [275.948185765904, 528.0254369698661],
                      [111.06907909458701, 552.795792593471],
                      [118.87138231445309, 701.365737015904],
                      [221.36468155133926, 758.7870354617745],
                      [307.86195445452006, 742.164737297712],
                      [366.8489324762834, 560.9895157073103],
                      [492.8750778390066, 560.9895157073103],
                      [492.8750778390066, 827.9639780566406],
                      [294.9255269587053, 827.9639780566406],
                      [282.79803391043527, 868.2476088113839]
                  ]
              }]
          }]
      };
  
      myChart.setOption(option);
  
  });
}

function d4() {
  return $.get(ROOT_PATH + 'Sicily_prehellenic_topographic_map.svg', function (svg) {

      echarts.registerMap('sicily', {svg: svg});
  
      return option = {
        title:{text:'地图'},
          tooltip: {
              formatter: function (params) {
                  console.log(params);
                  return [
                      params.name + ':',
                      'xxxxxxxxxxxxxxxx',
                      'xxxxxxxxxxxxxxxx',
                      'xxxxxxxxxxxxxxxx'
                  ].join('<br>')
              }
          },
          geo: [{
              map: 'sicily',
              roam: true,
              layoutCenter: ['50%', '50%'],
              layoutSize: '100%',
              selectedMode: 'single',
              tooltip: {
                  show: true,
                  confine: true,
                  formatter: function (params) {
                      return [
                          'This is the introduction:',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxx'
                      ].join('<br>');
                  }
              },
              itemStyle: {
                  color: null
              },
              emphasis: {
                  label: {
                      show: false
                  }
              },
              select: {
                  itemStyle: {
                      color: '#b50205'
                  },
                  label: {
                      show: false
                  }
              },
              tooltip: {
                  // Set it not enable tooltip in geo component.
                  show: true
              },
              regions: [{
                  name: 'route1',
                  itemStyle: {
                      borderWidth: 0
                  },
                  select: {
                      itemStyle: {
                          color: '#b5280d',
                          borderWidth: 0
                      }
                  },
                  tooltip: {
                      position: 'right',
                      alwaysShowContent: true,
                      enterable: true,
                      extraCssText: 'user-select: text',
                      formatter: [
                          'Route 1:',
                          'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
                      ].join('<br>')
                  }
              }, {
                  name: 'route2',
                  itemStyle: {
                      borderWidth: 0
                  },
                  select: {
                      itemStyle: {
                          color: '#b5280d',
                          borderWidth: 0
                      }
                  },
                  tooltip: {
                      position: 'left',
                      alwaysShowContent: true,
                      enterable: true,
                      extraCssText: 'user-select: text',
                      formatter: [
                          'Route 2:',
                          'xxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxx',
                          'xxxxxxxxxxxxxx'
                      ].join('<br>')
                  }
              }]
          }],
  
  
          // -------------
          // Make buttons
          grid: {
              top: 10,
              left: 'center',
              width: 80,
              height: 20
          },
          xAxis: { axisLine: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, axisTick: { show : false } },
          yAxis: { axisLine: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, axisTick: { show : false } },
          series: {
              type: 'scatter',
              itemStyle: {
              },
              label: {
                  show: true,
                  borderColor: '#999',
                  borderWidth: 1,
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  padding: [3, 5],
                  fontSize: 18,
                  opacity: 1,
                  color: '#333'
              },
              encode: {
                  label: 2
              },
              symbolSize: 0,
              tooltip: { show: false },
              selectedMode: 'single',
              select: {
                  label: {
                      color: '#fff',
                      borderColor: '#555',
                      backgroundColor: '#555'
                  }
              },
              data: [
                  [0, 0, 'route1'],
                  [1, 0, 'route2']
              ]
          }
          // Make buttons end
          // -----------------
      };
  
      myChart.setOption(option);
  
      myChart.on('selectchanged', function (params) {
          if (!params.selected.length) {
              myChart.dispatchAction({
                  type: 'hideTip'
              });
              myChart.dispatchAction({
                  type: 'geoSelect',
                  geoIndex: 0
                  // Use no name to unselect.
              });
          }
          else {
              var btnDataIdx = params.selected[0].dataIndex[0];
              var name = option.series.data[btnDataIdx][2];
  
              myChart.dispatchAction({
                  type: 'geoSelect',
                  geoIndex: 0,
                  name: name
              });
              myChart.dispatchAction({
                  type: 'showTip',
                  geoIndex: 0,
                  name: name
              });
          }
      });
  
  });
}

function d5() {
  return $.get(ROOT_PATH + 'ksia-ext-plan-min.svg', function (svg) {
      echarts.registerMap('ksia-ext-plan', { svg: svg });
  
      return option = {
        title:{text:'交通'},
          tooltip: {
          },
          geo: {
              map: 'ksia-ext-plan',
              roam: true,
              layoutCenter: ['50%', '50%'],
              layoutSize: '100%'
          },
          series: [{
              name: 'Route',
              type: 'lines',
              coordinateSystem: 'geo',
              geoIndex: 0,
              emphasis: {
                  label: {
                      show: false
                  }
              },
              polyline: true,
              lineStyle: {
                  color: '#c46e54',
                  width: 0
              },
              effect: {
                  show: true,
                  period: 8,
                  color: '#a10000',
                  // constantSpeed: 80,
                  trailLength: 0,
                  symbolSize: [12, 30],
                  symbol: 'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z'
              },
              z: 100,
              data: [{
                  effect: {
                      color: '#a10000',
                      constantSpeed: 100,
                      delay: 0,
                  },
                  coords: [
                      [50.875133928571415, 242.66287667410717],
                      [62.03696428571425, 264.482421875],
                      [72.63357421874997, 273.62779017857144],
                      [92.78291852678569, 285.869140625],
                      [113.43637834821425, 287.21854073660717],
                      [141.44788783482142, 288.92947823660717],
                      [191.71686104910714, 289.5507114955357],
                      [198.3060072544643, 294.0673828125],
                      [204.99699497767858, 304.60288783482144],
                      [210.79177734375003, 316.7373046875],
                      [212.45179408482142, 329.3656529017857],
                      [210.8885267857143, 443.3925083705358],
                      [215.35936941964286, 453.00634765625],
                      [224.38761997767858, 452.15087890625],
                      [265.71490792410714, 452.20179966517856],
                      [493.3408844866072, 453.77525111607144],
                      [572.8892940848216, 448.77992466517856],
                      [608.9513755580358, 448.43366350446433],
                      [619.99099609375, 450.8778599330358],
                      [624.2479715401787, 456.2194475446429],
                      [628.1434095982145, 463.9899553571429],
                      [629.8492550223216, 476.0276227678571],
                      [631.2750362723216, 535.7322126116071],
                      [624.6757059151787, 546.6496233258929],
                      [617.1801702008929, 552.6480887276786],
                      [603.7269056919645, 554.5066964285714],
                      [588.0178515625, 557.5517578125],
                      [529.4386104910716, 556.2991071428571],
                      [422.1994921875001, 551.38525390625],
                      [291.66921875, 552.5767996651786],
                      [219.4279380580357, 547.4949079241071],
                      [209.53912667410714, 541.5931919642858],
                      [206.70793247767858, 526.1947544642858],
                      [206.70793247767858, 507.4049944196429],
                      [206.12234375000003, 468.7663225446429],
                      [204.48778738839286, 459.44782366071433],
                      [197.56256417410714, 452.8943219866071],
                      [170.31995814732142, 456.27546037946433],
                      [1.8078906249999704, 460.5935407366071]
                  ]
              }, {
                  effect: {
                      color: '#00067d',
                      constantSpeed: 80,
                      delay: 0,
                  },
                  coords: [
                      [779.4595368303574, 287.98744419642856],
                      [689.07009765625, 291.0477818080357],
                      [301.83300223214286, 290.49783761160717],
                      [229.31165736607142, 291.73011997767856],
                      [220.73660156250003, 297.4077845982143],
                      [214.74832031250003, 308.52378627232144],
                      [213.82156250000003, 421.35400390625],
                      [213.19523716517858, 443.0564313616071],
                      [222.31005301339286, 455.95465959821433],
                      [271.71846540178575, 454.37611607142856],
                      [359.64843191964286, 455.9393833705358],
                      [580.2524358258929, 448.11286272321433],
                      [627.7156752232145, 460.7463030133929],
                      [632.3290959821429, 536.6386021205358],
                      [628.9123130580358, 548.4776785714286],
                      [612.5667494419645, 556.8235909598214],
                      [543.7167912946429, 555.4741908482143],
                      [429.1756361607143, 551.9402901785714],
                      [293.42089285714286, 551.2172154017858],
                      [226.20039899553575, 556.0699637276786],
                      [215.49176339285714, 562.7253069196429],
                      [213.21051339285714, 591.6024693080358],
                      [212.00878348214286, 625.6735491071429],
                      [197.43017020089286, 645.0743582589286],
                      [187.41405691964286, 647.0857282366071],
                      [101.79589285714286, 649.0207170758929],
                      [69.96023437499997, 650.1613420758929],
                      [56.48150948660714, 656.8268694196429],
                      [51.11446149553569, 665.2542550223214]
                  ]
              }, {
                  effect: {
                      color: '#997405',
                      constantSpeed: 60,
                      delay: 0,
                  },
                  coords: [
                      [2.5920703124999704, 450.66908482142856],
                      [204.0651450892857, 453.13364955357144],
                      [378.72844029017864, 453.13874162946433],
                      [551.1817745535716, 456.1532505580358],
                      [578.3734598214287, 456.91196986607144],
                      [601.2317885044645, 458.9895368303571],
                      [614.1503850446429, 462.1669921875],
                      [618.99294921875, 479.68882533482144],
                      [620.0826534598216, 513.5969587053571],
                      [615.6932840401787, 528.7306082589286],
                      [608.4829045758929, 533.2625558035714],
                      [592.7127455357145, 534.9582170758929],
                      [583.09890625, 527.5492466517858],
                      [578.6535239955358, 516.4077845982143],
                      [578.6535239955358, 498.36146763392856],
                      [577.9966462053571, 477.0613141741071],
                      [575.3691350446429, 469.1940569196429],
                      [569.0753292410716, 462.63037109375],
                      [553.9518638392858, 460.6444614955358],
                      [298.10051060267864, 465.61432756696433],
                      [193.49908761160714, 460.1759905133929],
                      [116.40505859374997, 465.78236607142856],
                      [3.5137360491071092, 463.47565569196433]
                  ]
              }]
          }]
      };
  
      myChart.setOption(option);
  
  });
}

function d6() {
  return $.get(ROOT_PATH + 'HK.json', function (geoJson) {
  
      echarts.registerMap('HK', geoJson);
  
      return option = {
          title: {
              text: '香港18区人口密度 （2011）',
              subtext: '人口密度数据来自Wikipedia',
              sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{b}<br/>{c} (p / km2)'
          },
          toolbox: {
              show: true,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                  dataView: {readOnly: false},
                  restore: {},
                  saveAsImage: {}
              }
          },
          visualMap: {
              min: 800,
              max: 50000,
              text: ['High', 'Low'],
              realtime: false,
              calculable: true,
              inRange: {
                  color: ['lightskyblue', 'yellow', 'orangered']
              }
          },
          series: [
              {
                  name: '香港18区人口密度',
                  type: 'map',
                  mapType: 'HK', // 自定义扩展图表类型
                  label: {
                      show: true
                  },
                  data: [
                      {name: '中西区', value: 20057.34},
                      {name: '湾仔', value: 15477.48},
                      {name: '东区', value: 31686.1},
                      {name: '南区', value: 6992.6},
                      {name: '油尖旺', value: 44045.49},
                      {name: '深水埗', value: 40689.64},
                      {name: '九龙城', value: 37659.78},
                      {name: '黄大仙', value: 45180.97},
                      {name: '观塘', value: 55204.26},
                      {name: '葵青', value: 21900.9},
                      {name: '荃湾', value: 4918.26},
                      {name: '屯门', value: 5881.84},
                      {name: '元朗', value: 4178.01},
                      {name: '北区', value: 2227.92},
                      {name: '大埔', value: 2180.98},
                      {name: '沙田', value: 9172.94},
                      {name: '西贡', value: 3368},
                      {name: '离岛', value: 806.98}
                  ],
                  // 自定义名称映射
                  nameMap: {
                      'Central and Western': '中西区',
                      'Eastern': '东区',
                      'Islands': '离岛',
                      'Kowloon City': '九龙城',
                      'Kwai Tsing': '葵青',
                      'Kwun Tong': '观塘',
                      'North': '北区',
                      'Sai Kung': '西贡',
                      'Sha Tin': '沙田',
                      'Sham Shui Po': '深水埗',
                      'Southern': '南区',
                      'Tai Po': '大埔',
                      'Tsuen Wan': '荃湾',
                      'Tuen Mun': '屯门',
                      'Wan Chai': '湾仔',
                      'Wong Tai Sin': '黄大仙',
                      'Yau Tsim Mong': '油尖旺',
                      'Yuen Long': '元朗'
                  }
              }
          ]
      }
  });
}

let options = [
  d1, d2, d3, d4, d5, d6,
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