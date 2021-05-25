<!-- Create By xBoson System -->

<template>
  <dv-border-box-7>
    <center>
      <div class='t'>{{ title }}</div>
      <h4 :style='color()'>{{ value }}</h4>
      <span class='u'>{{ unit }}</span>
    </center>
  </dv-border-box-7>
</template>

<script>
let c = ['red', '#9093ff', '#c9e014', '#14dee0', '#e759e8'];

export default {
  props: ['title', 'value', 'unit'],
  
  methods: {
    color() {
      return 'color:'+ c[parseInt(Math.random() * c.length)];
    }
  }
}
</script>

<style scoped>
h4 {
  display: inline-block;
}
.t {
  padding-top: 20px;
}
.u, h4 {
  padding-top: 20px;
}
center {
  /*padding-top: 30%;*/
}
</style>