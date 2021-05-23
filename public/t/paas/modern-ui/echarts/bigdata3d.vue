<!-- Create By xBoson System -->

<template><doc>
  <h2>海量数据</h2>
  
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

function d5() {
  return $.getJSON(ROOT_PATH + 'internet.graph.json', function (graph) {
    var edges = graph.edges.map(function (edge) {
        return {
            source: edge[0],
            target: edge[1],
            value: 2
        }
    });
    var categories = [];
    var categoriesMap = {};
    var nodes = graph.nodes.map(function (node) {
        if (!categoriesMap[node[3]]) {
            categories.push({
                name: node[3]
            });
            categoriesMap[node[3]] = true;
        }
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            // x: node[0],
            // y: node[1],
            symbolSize: node[2],
            category: node[3],
            value: 1
        }
    });


    return myChart.setOption({
        color: ["rgb(203,239,15)", "rgb(73,15,239)","rgb(239,231,15)","rgb(15,217,239)","rgb(30,15,239)","rgb(15,174,239)","rgb(116,239,15)","rgb(239,15,58)","rgb(15,239,174)","rgb(239,102,15)","rgb(239,15,15)","rgb(15,44,239)","rgb(239,145,15)","rgb(30,239,15)","rgb(239,188,15)","rgb(159,239,15)","rgb(159,15,239)","rgb(15,239,44)","rgb(15,239,87)","rgb(15,239,217)","rgb(203,15,239)","rgb(239,15,188)","rgb(239,15,102)","rgb(239,58,15)","rgb(239,15,145)","rgb(116,15,239)","rgb(15,131,239)","rgb(73,239,15)","rgb(15,239,131)","rgb(15,87,239)","rgb(239,15,231)"],
        series: [{
            type: 'graphGL',
            nodes: nodes,
            edges: edges,
            categories: categories.sort(function (a, b) { return a.name - b.name; }),
            lineStyle: {
                color: 'rgba(255,255,255,0.2)'
            },
            itemStyle: {
                opacity: 1
            },
            forceAtlas2: {
                steps: 1,
                stopThreshold: 1,
                jitterTolerence: 10,
                edgeWeight: [0.2, 1],
                gravity: 0,
                edgeWeightInfluence: 1,
                scaling: 0.2
            }
        }]
    });
});
}

let options = [
  d5,
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