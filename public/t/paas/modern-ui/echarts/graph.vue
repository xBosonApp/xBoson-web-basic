<!-- Create By xBoson System -->

<template><doc>
  <h2>关系图</h2>
  
  <div v-for='(op, i) in options'>
    <chart :option='op'></chart>
  </div>
  
</doc></template>

<script>
const ROOT_PATH = "";
const $ = require("./data.js");
//const ecStat = require('cdn/echarts-stat/1.2.0/ecStat.min.js');
//const ecSimpleTransform = require("./data/ecSimpleTransform.min.js", 0, 0, 1)
let option;


// 这里插入数据生成代码
function d1() {
   var axisData = ['周一', '周二', '周三', '很长很长的周四', '周五', '周六', '周日'];
  var data = axisData.map(function (item, i) {
      return Math.round(Math.random() * 1000 * (i + 1));
  });
  var links = data.map(function (item, i) {
      return {
          source: i,
          target: i + 1
      };
  });
  links.pop();
  return option = {
      title: {
          text: '笛卡尔坐标系上的 Graph'
      },
      tooltip: {},
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: axisData
      },
      yAxis: {
          type: 'value'
      },
      series: [
          {
              type: 'graph',
              layout: 'none',
              coordinateSystem: 'cartesian2d',
              symbolSize: 40,
              label: {
                  show: true
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              data: data,
              links: links,
              lineStyle: {
                  color: '#2f4554'
              }
          }
      ]
  };
}

function d2() {
  return $.get(ROOT_PATH + 'les-miserables.json', function (graph) {
    // myChart.hideLoading();
    graph.nodes.forEach(function (node) {
        node.symbolSize = 5;
    });
    return option = {
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        legend: [{
            // selectedMode: 'single',
            data: graph.categories.map(function (a) {
                return a.name;
            })
        }],
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    position: 'right'
                },
                force: {
                    repulsion: 100
                }
            }
        ]
    };

    myChart.setOption(option);
});
}

function d3() {
  return $.getJSON(ROOT_PATH + 'les-miserables.json', function (graph) {
      
  
      return option = {
          tooltip: {},
          legend: [{
              data: graph.categories.map(function (a) {
                  return a.name;
              })
          }],
          series: [
              {
                  name: 'Les Miserables',
                  type: 'graph',
                  layout: 'none',
                  data: graph.nodes,
                  links: graph.links,
                  categories: graph.categories,
                  roam: true,
                  label: {
                      show: true,
                      position: 'right',
                      formatter: '{b}'
                  },
                  labelLayout: {
                      hideOverlap: true
                  },
                  scaleLimit: {
                      min: 0.4,
                      max: 2
                  },
                  lineStyle: {
                      color: 'source',
                      curveness: 0.3
                  }
              }
          ]
      };
  
      myChart.setOption(option);
  });
}

function d4() {
  return $.getJSON(ROOT_PATH + 'les-miserables.json', function (graph) {
  
      graph.nodes.forEach(function (node) {
          node.label = {
              show: node.symbolSize > 30
          };
      });
  
      return option = {
          title: {
              text: 'Les Miserables',
              subtext: 'Circular layout',
              top: 'bottom',
              left: 'right'
          },
          tooltip: {},
          legend: [{
              data: graph.categories.map(function (a) {
                  return a.name;
              })
          }],
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
              {
                  name: 'Les Miserables',
                  type: 'graph',
                  layout: 'circular',
                  circular: {
                      rotateLabel: true
                  },
                  data: graph.nodes,
                  links: graph.links,
                  categories: graph.categories,
                  roam: true,
                  label: {
                      position: 'right',
                      formatter: '{b}'
                  },
                  lineStyle: {
                      color: 'source',
                      curveness: 0.3
                  }
              }
          ]
      };
  
      myChart.setOption(option);
  });
}

function d7() {
  return $.get(ROOT_PATH + 'life-expectancy.json', function (data) {
      var series = data.series;
       option = {
          visualMap: {
              show: false,
              min: 0,
              max: 100,
              dimension: 1
          },
          legend: {
              data: data.counties,
              selectedMode: 'single',
              right: 100
          },
          grid: {
              left: 0,
              bottom: 0,
              containLabel: true,
              top: 80
          },
          xAxis: {
              type: 'value'
          },
          yAxis: {
              type: 'value',
              scale: true
          },
          toolbox: {
              feature: {
                  dataZoom: {}
              }
          },
          dataZoom: {
              type: 'inside'
          },
          series: []
      };
  
      data.counties.forEach(function (country) {
          var data = series.map(function (yearData) {
              var item = yearData.filter(function (item) {
                  return item[3] === country;
              })[0];
              return {
                  label: {
                      show: item[4] % 20 === 0 && item[4] > 1940,
                      position: 'top'
                  },
                  emphasis: {
                      label: {
                          show: true
                      }
                  },
                  name: item[4],
                  value: item
              };
          });
          var links = data.map(function (item, idx) {
              return {
                  source: idx,
                  target: idx + 1
              };
          });
          links.pop();
  
          option.series.push({
              name: country,
              type: 'graph',
              coordinateSystem: 'cartesian2d',
              data: data,
              links: links,
              edgeSymbol: ['none', 'arrow'],
              edgeSymbolSize: 5,
              legendHoverLink: false,
              lineStyle: {
                  color: '#333'
              },
              itemStyle: {
                  borderWidth: 1,
                  borderColor: '#333'
              },
              label: {
                  color: '#333',
                  position: 'right'
              },
              symbolSize: 10,
              animationDelay: function (idx) {
                  return idx * 100;
              }
          });
      });
  
  return option;
      myChart.setOption(option);
  });
}

function d5() {
  return $.get(ROOT_PATH + 'webkit-dep.json', function (webkitDep) {
      // myChart.hideLoading();
  
      return option = {
          legend: {
              data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
          },
          series: [{
              type: 'graph',
              layout: 'force',
              animation: false,
              label: {
                  position: 'right',
                  formatter: '{b}'
              },
              draggable: true,
              data: webkitDep.nodes.map(function (node, idx) {
                  node.id = idx;
                  return node;
              }),
              categories: webkitDep.categories,
              force: {
                  edgeLength: 5,
                  repulsion: 20,
                  gravity: 0.2
              },
              edges: webkitDep.links
          }]
      };
  
      myChart.setOption(option);
  });
}

function d6() {
  // myChart.showLoading();
  return $.getJSON(ROOT_PATH + 'npmdepgraph.min10.json', function (json) {
      // myChart.hideLoading();
      return (option = {
          title: {
              text: 'NPM Dependencies'
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [{
              type: 'graph',
              layout: 'none',
              // progressiveThreshold: 700,
              data: json.nodes.map(function (node) {
                  return {
                      x: node.x,
                      y: node.y,
                      id: node.id,
                      name: node.label,
                      symbolSize: node.size,
                      itemStyle: {
                          color: node.color
                      }
                  };
              }),
              edges: json.edges.map(function (edge) {
                  return {
                      source: edge.sourceID,
                      target: edge.targetID
                  };
              }),
              emphasis: {
                  focus: 'adjacency',
                  label: {
                      position: 'right',
                      show: true
                  }
              },
              roam: true,
              lineStyle: {
                  width: 0.5,
                  curveness: 0.3,
                  opacity: 0.7
              }
          }]
      });
  });
}

let options = [
  d1(), d2, d3, d4, d5, d6, d7,
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