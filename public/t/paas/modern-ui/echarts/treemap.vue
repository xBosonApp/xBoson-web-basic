<!-- Create By xBoson System -->

<template><doc>
  <h2>矩形树图</h2>
  
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
  myChart.showLoading();

  return $.get(ROOT_PATH + 'disk.tree.json', function (diskData) {
      myChart.hideLoading();
  
      function colorMappingChange(value) {
          var levelOption = getLevelOption(value);
          chart.setOption({
              series: [{
                  levels: levelOption
              }]
          });
      }
  
      var formatUtil = echarts.format;
  
      function getLevelOption() {
          return [
              {
                  itemStyle: {
                      borderWidth: 0,
                      gapWidth: 5
                  }
              },
              {
                  itemStyle: {
                      gapWidth: 1
                  }
              },
              {
                  colorSaturation: [0.35, 0.5],
                  itemStyle: {
                      gapWidth: 1,
                      borderColorSaturation: 0.6
                  }
              }
          ];
      }
  
      return myChart.setOption(option = {
  
          title: {
              text: 'Disk Usage',
              left: 'center'
          },
  
          tooltip: {
              formatter: function (info) {
                  var value = info.value;
                  var treePathInfo = info.treePathInfo;
                  var treePath = [];
  
                  for (var i = 1; i < treePathInfo.length; i++) {
                      treePath.push(treePathInfo[i].name);
                  }
  
                  return [
                      '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                      'Disk Usage: ' + formatUtil.addCommas(value) + ' KB',
                  ].join('');
              }
          },
  
          series: [
              {
                  name: 'Disk Usage',
                  type: 'treemap',
                  visibleMin: 300,
                  label: {
                      show: true,
                      formatter: '{b}'
                  },
                  itemStyle: {
                      borderColor: '#fff'
                  },
                  levels: getLevelOption(),
                  data: diskData
              }
          ]
      });
  });
}

function d2() {
  var uploadedDataURL = ROOT_PATH + 'ec-option-doc-statistics-201604.json';
  
  myChart.showLoading();
  
  return $.getJSON(uploadedDataURL, function (rawData) {
  
      myChart.hideLoading();
  
      function convert(source, target, basePath) {
          for (var key in source) {
              var path = basePath ? (basePath + '.' + key) : key;
              if (!key.match(/^\$/)) {
                  target.children = target.children || [];
                  var child = {
                      name: path
                  };
                  target.children.push(child);
                  convert(source[key], child, path);
              }
          }
  
          if (!target.children) {
              target.value = source.$count || 1;
          }
          else {
              target.children.push({
                  name: basePath,
                  value: source.$count
              });
          }
      }
  
      var data = [];
  
      convert(rawData, data, '');
  
      return myChart.setOption(option = {
          title: {
              text: 'ECharts 配置项查询分布',
              subtext: '2016/04',
              left: 'leafDepth'
          },
          tooltip: {},
          series: [{
              name: 'option',
              type: 'treemap',
              visibleMin: 300,
              data: data.children,
              leafDepth: 2,
              levels: [
                  {
                      itemStyle: {
                          borderColor: '#555',
                          borderWidth: 4,
                          gapWidth: 4
                      }
                  },
                  {
                      colorSaturation: [0.3, 0.6],
                      itemStyle: {
                          borderColorSaturation: 0.7,
                          gapWidth: 2,
                          borderWidth: 2
                      }
                  },
                  {
                      colorSaturation: [0.3, 0.5],
                      itemStyle: {
                          borderColorSaturation: 0.6,
                          gapWidth: 1
                      }
                  },
                  {
                      colorSaturation: [0.3, 0.5]
                  }
              ]
          }]
      });
  });
}

function d3() {
  myChart.showLoading();
  
  var household_america_2012 = 113616229;
  return $.get(ROOT_PATH + '/data/asset/data/obama_budget_proposal_2012.json', function (obama_budget_2012) {
      myChart.hideLoading();
  
      var formatUtil;
  
      function buildData(mode, originList) {
          var out = [];
  
          for (var i = 0; i < originList.length; i++) {
              var node = originList[i];
              var newNode = out[i] = cloneNodeInfo(node);
              var value = newNode.value;
  
              if (!newNode) {
                  continue;
              }
  
              // Calculate amount per household.
              value[3] = value[0] / household_america_2012;
  
              // if mode === 0 and mode === 2 do nothing
              if (mode === 1) {
                  // Set 'Change from 2010' to value[0].
                  var tmp = value[1];
                  value[1] = value[0];
                  value[0] = tmp;
              }
  
              if (node.children) {
                  newNode.children = buildData(mode, node.children);
              }
          }
  
          return out;
      }
  
      function cloneNodeInfo(node) {
          if (!node) {
              return;
          }
  
          var newNode = {};
          newNode.name = node.name;
          newNode.id = node.id;
          newNode.discretion = node.discretion;
          newNode.value = (node.value || []).slice();
          return newNode;
      }
  
      function getLevelOption(mode) {
          return [
              {
                  color: mode === 2
                      ? [
                          '#c23531', '#314656', '#61a0a8', '#dd8668',
                          '#91c7ae', '#6e7074', '#61a0a8', '#bda29a',
                          '#44525d', '#c4ccd3'
                      ]
                      : null,
                  colorMappingBy: 'id',
                  itemStyle: {
                      normal: {
                          borderWidth: 3,
                          gapWidth: 3
                      }
                  }
              },
              {
                  colorAlpha: mode === 2
                      ? [0.5, 1] : null,
                  itemStyle: {
                      normal: {
                          gapWidth: 1
                      }
                  }
              }
          ];
      }
  
      function isValidNumber(num) {
          return num != null && isFinite(num);
      }
  
      function getTooltipFormatter(mode) {
          var amountIndex = mode === 1 ? 1 : 0;
          var amountIndex2011 = mode === 1 ? 0 : 1;
  
          return function (info) {
              var value = info.value;
  
              var amount = value[amountIndex];
              amount = isValidNumber(amount)
                  ? formatUtil.addCommas(amount * 1000) + '$'
                  : '-';
  
              var amount2011 = value[amountIndex2011];
              amount2011 = isValidNumber(amount2011)
                  ? formatUtil.addCommas(amount2011 * 1000) + '$'
                  : '-';
  
              var perHousehold = value[3];
              perHousehold = isValidNumber(perHousehold)
                  ? formatUtil.addCommas((+perHousehold.toFixed(4)) * 1000) + '$'
                  : '-';
  
              var change = value[2];
              change = isValidNumber(change)
                  ? change.toFixed(2) + '%'
                  : '-';
  
              return [
                  '<div class="tooltip-title">' + formatUtil.encodeHTML(info.name) + '</div>',
                  '2012 Amount: &nbsp;&nbsp;' + amount + '<br>',
                  'Per Household: &nbsp;&nbsp;' + perHousehold + '<br>',
                  '2011 Amount: &nbsp;&nbsp;' + amount2011 + '<br>',
                  'Change From 2011: &nbsp;&nbsp;' + change
              ].join('');
          };
      }
  
      function createSeriesCommon(mode) {
          return {
              type: 'treemap',
              tooltip: {
                  formatter: getTooltipFormatter(mode)
              },
              label: {
                  normal: {
                      position: 'insideTopLeft',
                      formatter: function (params) {
                          var arr = [
                              '{name|' + params.name + '}',
                              '{hr|}',
                              '{budget|$ ' + echarts.format.addCommas(params.value[0]) + '} {label|budget}'
                          ];
  
                          mode !== 1 && arr.push(
                              '{household|$ ' + echarts.format.addCommas((+params.value[3].toFixed(4)) * 1000) + '} {label|per household}'
                          );
  
                          return arr.join('\n');
                      },
                      rich: {
                          budget: {
                              fontSize: 22,
                              lineHeight: 30,
                              color: 'yellow'
                          },
                          household: {
                              fontSize: 14,
                              color: '#fff'
                          },
                          label: {
                              fontSize: 9,
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              color: '#fff',
                              borderRadius: 2,
                              padding: [2, 4],
                              lineHeight: 25,
                              align: 'right'
                          },
                          name: {
                              fontSize: 12,
                              color: '#fff'
                          },
                          hr: {
                              width: '100%',
                              borderColor: 'rgba(255,255,255,0.2)',
                              borderWidth: 0.5,
                              height: 0,
                              lineHeight: 10
                          }
                      }
                  }
              },
              itemStyle: {
                  normal: {
                      borderColor: 'black'
                  }
              },
              levels: getLevelOption(0)
          };
      }
  
      formatUtil = echarts.format;
      var modes = ['2012Budget', '2011Budget', 'Growth'];
  
      return myChart.setOption(option = {
          title: {
              top: 5,
              left: 'center',
              text: 'How $3.7 Trillion is Spent',
              subtext: 'Obama’s 2012 Budget Proposal'
          },
  
          legend: {
              data: modes,
              selectedMode: 'single',
              top: 55,
              itemGap: 5,
              borderRadius: 5
          },
  
          tooltip: {
          },
  
          series: modes.map(function (mode, idx) {
              var seriesOpt = createSeriesCommon(idx);
              seriesOpt.name = mode;
              seriesOpt.top = 80;
              seriesOpt.visualDimension = idx === 2 ? 2 : null;
              seriesOpt.data = buildData(idx, obama_budget_2012);
              seriesOpt.levels = getLevelOption(idx);
              return seriesOpt;
          })
      });
  });
}

function d4() {
  myChart.showLoading();

  return $.get(ROOT_PATH + '/data/asset/data/disk.tree.json', function (diskData) {
      myChart.hideLoading();
  
      function colorMappingChange(value) {
          var levelOption = getLevelOption(value);
          chart.setOption({
              series: [{
                  levels: levelOption
              }]
          });
      }
  
      var formatUtil = echarts.format;
  
      function getLevelOption() {
          return [
              {
                  itemStyle: {
                      borderColor: '#777',
                      borderWidth: 0,
                      gapWidth: 1
                  },
                  upperLabel: {
                      show: false
                  }
              },
              {
                  itemStyle: {
                      borderColor: '#555',
                      borderWidth: 5,
                      gapWidth: 1
                  },
                  emphasis: {
                      itemStyle: {
                          borderColor: '#ddd'
                      }
                  }
              },
              {
                  colorSaturation: [0.35, 0.5],
                  itemStyle: {
                      borderWidth: 5,
                      gapWidth: 1,
                      borderColorSaturation: 0.6
                  }
              }
          ];
      }
  
      return myChart.setOption(option = {
  
          title: {
              text: 'Disk Usage',
              left: 'center'
          },
  
          tooltip: {
              formatter: function (info) {
                  var value = info.value;
                  var treePathInfo = info.treePathInfo;
                  var treePath = [];
  
                  for (var i = 1; i < treePathInfo.length; i++) {
                      treePath.push(treePathInfo[i].name);
                  }
  
                  return [
                      '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                      'Disk Usage: ' + formatUtil.addCommas(value) + ' KB',
                  ].join('');
              }
          },
  
          series: [
              {
                  name: 'Disk Usage',
                  type: 'treemap',
                  visibleMin: 300,
                  label: {
                      show: true,
                      formatter: '{b}'
                  },
                  upperLabel: {
                      show: true,
                      height: 30
                  },
                  itemStyle: {
                      borderColor: '#fff'
                  },
                  levels: getLevelOption(),
                  data: diskData
              }
          ]
      });
  });
}

function d5() {
  return option = {
      series: [{
          type: 'treemap',
          data: [{
              name: 'nodeA',            // First tree
              value: 10,
              children: [{
                  name: 'nodeAa',       // First leaf of first tree
                  value: 4
              }, {
                  name: 'nodeAb',       // Second leaf of first tree
                  value: 6
              }]
          }, {
              name: 'nodeB',            // Second tree
              value: 20,
              children: [{
                  name: 'nodeBa',       // Son of first tree
                  value: 20,
                  children: [{
                      name: 'nodeBa1',  // Granson of first tree
                      value: 20
                  }]
              }]
          }]
      }]
  };
}

function d6() {
  myChart.showLoading();
  
  var household_america_2012 = 113616229;
  return $.get(ROOT_PATH + '/data/asset/data/obama_budget_proposal_2012.json', function (obama_budget_2012) {
      myChart.hideLoading();
  
      var visualMin = -100;
      var visualMax = 100;
      var visualMinBound = -40;
      var visualMaxBound = 40;
  
      convertData(obama_budget_2012);
  
      function convertData(originList) {
          var min = Infinity;
          var max = -Infinity;
  
          for (var i = 0; i < originList.length; i++) {
              var node = originList[i];
              if (node) {
                  var value = node.value;
                  value[2] != null && value[2] < min && (min = value[2]);
                  value[2] != null && value[2] > max && (max = value[2]);
              }
          }
  
          for (var i = 0; i < originList.length; i++) {
              var node = originList[i];
              if (node) {
                  var value = node.value;
  
                  // Scale value for visual effect
                  if (value[2] != null && value[2] > 0) {
                      value[3] = echarts.number.linearMap(
                          value[2], [0, max], [visualMaxBound, visualMax], true
                      );
                  }
                  else if (value[2] != null && value[2] < 0) {
                      value[3] = echarts.number.linearMap(
                          value[2], [min, 0], [visualMin, visualMinBound], true
                      );
                  }
                  else {
                      value[3] = 0;
                  }
  
                  if (!isFinite(value[3])) {
                      value[3] = 0;
                  }
  
                  if (node.children) {
                      convertData(node.children);
                  }
              }
          }
      }
  
  
      function isValidNumber(num) {
          return num != null && isFinite(num);
      }
  
      return myChart.setOption(option = {
          title: {
              left: 'center',
              text: 'Gradient Mapping',
              subtext: 'Growth > 0: green; Growth < 0: red; Growth = 0: grey'
          },
          tooltip: {
              formatter: function (info) {
                  var value = info.value;
  
                  var amount = value[0];
                  amount = isValidNumber(amount)
                      ? echarts.format.addCommas(amount * 1000) + '$'
                      : '-';
  
                  var amount2011 = value[1];
                  amount2011 = isValidNumber(amount2011)
                      ? echarts.format.addCommas(amount2011 * 1000) + '$'
                      : '-';
  
                  var change = value[2];
                  change = isValidNumber(change)
                      ? change.toFixed(2) + '%'
                      : '-';
  
                  return [
                      '<div class="tooltip-title">' + echarts.format.encodeHTML(info.name) + '</div>',
                      '2012 Amount: &nbsp;&nbsp;' + amount + '<br>',
                      '2011 Amount: &nbsp;&nbsp;' + amount2011 + '<br>',
                      'Change From 2011: &nbsp;&nbsp;' + change
                  ].join('');
              }
          },
          series: [{
              name: 'ALL',
              top: 80,
              type: 'treemap',
              label: {
                  show: true,
                  formatter: "{b}",
                  normal: {
                      textStyle: {
                          ellipsis: true
                      }
                  }
              },
              itemStyle: {
                  normal: {
                      borderColor: 'black'
                  }
              },
              visualMin: visualMin,
              visualMax: visualMax,
              visualDimension: 3,
              levels: [
                  {
                      itemStyle: {
                          borderWidth: 3,
                          borderColor: '#333',
                          gapWidth: 3
                      }
                  },
                  {
                      color: ['#942e38', '#aaa', '#269f3c'],
                      colorMappingBy: 'value',
                      itemStyle: {
                          gapWidth: 1
                      }
                  }
              ],
              data: obama_budget_2012
          }]
      });
  
  
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