<!-- Create By xBoson System -->

<template><doc>
  <h2>饼图</h2>
  
  <div v-for='(op, i) in options'>
    <chart :option='op'></chart>
  </div>
  
</doc></template>

<script>
function d2() {
  var data = genData(50);

  return {
      title: {
          text: '同名数量统计',
          subtext: '纯属虚构',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData,
  
          selected: data.selected
      },
      series: [
          {
              name: '姓名',
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: data.seriesData,
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
  
  function genData(count) {
      var nameList = [
          '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
      ];
      var legendData = [];
      var seriesData = [];
      for (var i = 0; i < count; i++) {
          var name = Math.random() > 0.65
              ? makeWord(4, 1) + '·' + makeWord(3, 0)
              : makeWord(2, 1);
          legendData.push(name);
          seriesData.push({
              name: name,
              value: Math.round(Math.random() * 100000)
          });
      }
  
      return {
          legendData: legendData,
          seriesData: seriesData
      };
  
      function makeWord(max, min) {
          var nameLen = Math.ceil(Math.random() * max + min);
          var name = [];
          for (var i = 0; i < nameLen; i++) {
              name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
          }
          return name.join('');
      }
  }
}

function d3() {
  var datas = [
      ////////////////////////////////////////
      [
          { name: '圣彼得堡来客', value: 5.6 },
          { name: '陀思妥耶夫斯基全集', value: 1 },
          { name: '史记精注全译（全6册）', value: 0.8 },
          { name: '加德纳艺术通史', value: 0.5 },
          { name: '表象与本质', value: 0.5 },
          { name: '其它', value: 3.8 }
      ],
      // ////////////////////////////////////////
      [
          { name: '银河帝国5：迈向基地', value: 3.8 },
          { name: '俞军产品方法论', value: 2.3 },
          { name: '艺术的逃难', value: 2.2 },
          { name: '第一次世界大战回忆录（全五卷）', value: 1.3 },
          { name: 'Scrum 精髓', value: 1.2 },
          { name: '其它', value: 5.7 }
      ],
  
      ////////////////////////////////////////
      [
          { name: '克莱因壶', value: 3.5 },
          { name: '投资最重要的事', value: 2.8 },
          { name: '简读中国史', value: 1.7 },
          { name: '你当像鸟飞往你的山', value: 1.4 },
          { name: '表象与本质', value: 0.5 },
          { name: '其它', value: 3.8 }
      ]
  ];
  
  return {
      title: {
          text: '阅读书籍分布',
          left: 'center',
          textStyle: {
              color: '#999',
              fontWeight: 'normal',
              fontSize: 14
          }
      },
      series: datas.map(function (data, idx) {
          var top = idx * 33.3;
          return {
              type: 'pie',
              radius: [20, 60],
              top: top + '%',
              height: '33.33%',
              left: 'center',
              width: 400,
              itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1
              },
              label: {
                  alignTo: 'edge',
                  formatter: '{name|{b}}\n{time|{c} 小时}',
                  minMargin: 5,
                  edgeDistance: 10,
                  lineHeight: 15,
                  rich: {
                      time: {
                          fontSize: 10,
                          color: '#999'
                      }
                  }
              },
              labelLine: {
                  length: 15,
                  length2: 0,
                  maxSurfaceAngle: 80
              },
              labelLayout: function (params) {
                  // var isLeft = params.labelRect.x < myChart.getWidth() / 2;
                  var points = params.labelLinePoints;
                  // Update the end point.
                  points[2][0] = true
                      ? params.labelRect.x
                      : params.labelRect.x + params.labelRect.width;
  
                  return {
                      labelLinePoints: points
                  };
              },
              data: data
          }
      })
  };
}

let options = [
{
    title: {
        text: '南丁格尔玫瑰图',
        subtext: '纯属虚构',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        left: 'center',
        top: 'bottom',
        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
    },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    series: [
        {
            name: '半径模式',
            type: 'pie',
            radius: [20, 140],
            center: ['25%', '50%'],
            roseType: 'radius',
            itemStyle: {
                borderRadius: 5
            },
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true
                }
            },
            data: [
                {value: 40, name: 'rose 1'},
                {value: 33, name: 'rose 2'},
                {value: 28, name: 'rose 3'},
                {value: 22, name: 'rose 4'},
                {value: 20, name: 'rose 5'},
                {value: 15, name: 'rose 6'},
                {value: 12, name: 'rose 7'},
                {value: 10, name: 'rose 8'}
            ]
        },
        {
            name: '面积模式',
            type: 'pie',
            radius: [20, 140],
            center: ['75%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 5
            },
            data: [
                {value: 30, name: 'rose 1'},
                {value: 28, name: 'rose 2'},
                {value: 26, name: 'rose 3'},
                {value: 24, name: 'rose 4'},
                {value: 22, name: 'rose 5'},
                {value: 20, name: 'rose 6'},
                {value: 18, name: 'rose 7'},
                {value: 16, name: 'rose 8'}
            ]
        }
    ]
},
d2(),
d3(),
{
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
                position: 'inner',
                fontSize: 14,
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 1548, name: '搜索引擎'},
                {value: 775, name: '直达'},
                {value: 679, name: '营销广告', selected: true}
            ]
        },
        {
            name: '访问来源',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
                length: 30,
            },
            label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#F6F8FC',
                borderColor: '#8C8D8E',
                borderWidth: 1,
                borderRadius: 4,
                
                rich: {
                    a: {
                        color: '#6E7079',
                        lineHeight: 22,
                        align: 'center'
                    },
                    hr: {
                        borderColor: '#8C8D8E',
                        width: '100%',
                        borderWidth: 1,
                        height: 0
                    },
                    b: {
                        color: '#4C5058',
                        fontSize: 14,
                        fontWeight: 'bold',
                        lineHeight: 33
                    },
                    per: {
                        color: '#fff',
                        backgroundColor: '#4C5058',
                        padding: [3, 4],
                        borderRadius: 4
                    }
                }
            },
            data: [
                {value: 1048, name: '百度'},
                {value: 335, name: '直达'},
                {value: 310, name: '邮件营销'},
                {value: 251, name: '谷歌'},
                {value: 234, name: '联盟广告'},
                {value: 147, name: '必应'},
                {value: 135, name: '视频广告'},
                {value: 102, name: '其他'}
            ]
        }
    ]
},
{
        legend: {},
        tooltip: {
            trigger: 'axis',
            showContent: false
        },
        dataset: {
            source: [
                ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
                ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
                ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
                ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
            ]
        },
        xAxis: {type: 'category'},
        yAxis: {gridIndex: 0},
        grid: {top: '55%'},
        series: [
            {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            {type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                center: ['50%', '25%'],
                emphasis: {focus: 'data'},
                label: {
                    formatter: '{b}: {@2012} ({d}%)'
                },
                encode: {
                    itemName: 'product',
                    value: '2012',
                    tooltip: '2012'
                }
            }
        ]
    }
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