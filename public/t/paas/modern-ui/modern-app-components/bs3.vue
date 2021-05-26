<!-- Create By xBoson System -->

<template>
  <div>
    <span style='padding-left: 20px'>{{title}}</span>
    <dv-decoration-4 :reverse="true" style="width:100%;height:5px;" />
    <!--<dv-charts :option="option" style='width: 100%; height:150px;'/>-->
    <v-chart :option="option" autoresize theme='dark' style='width:100%; height:100%;'/>
  </div>
</template>

<script>
const colors = ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'];

const def_option = {
  color: colors,
  darkMode : true,
  backgroundColor:'rgba(128, 128, 128, 0.1)' ,
  radar: {
    indicator: [
      { name: '西峡', max: 300 },
      { name: '周口', max: 300 },
      { name: '南阳', max: 300 },
      { name: '驻马店', max: 300 },
      { name: '郑州', max: 300 },
      { name: '洛阳', max: 300 }
    ],
    polygon: true,
    axisLine: {
      style: {
        stroke: 'rgba(251, 114, 147, .3)'
      }
    },
    splitLine: {
      style: {
        stroke: 'rgba(251, 114, 147, .5)',
        fill: 'rgba(251, 114, 147, .2)'
      }
    }
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [111, 256, 178, 152, 266, 132],
        }
      ]
    }
  ]
};

export default {
  props: ['title', 'option'],
  
  mounted() {
    let opt = this.option || {};
    for (let n in def_option) {
      if (!opt[n]) {
        opt[n] = def_option[n];
      }
    }
    this.option = opt;
  },
}
</script>

<style>
</style>