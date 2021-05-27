<!-- Create By xBoson System -->

<template>
  <dv-border-box-7 style='display: flex'>
    <div>
      <h5 class='title'>{{title}}</h5> 
      <span class='index'>0{{index}}</span>
    </div>
    <div style='flex:1'>
      <dv-active-ring-chart :config="config" style='width:100%; height:180px'/>
    </div>
    <div style='display:flex'>
      <div class='x'>
        <div>累计金额</div>
        <div class='a'>{{value}}</div>
        <span class='b'>元</span>
      </div>
      <div class='x'>
        <div>巡查病害</div>
        <div class='c'>55</div>
        <span class='b'>处</span>
      </div>
    </div>
  </dv-border-box-7>
</template>

<script>
export default {
  props : ['title', 'index', 'value', 'total'],
  
  data() {
    let v1 = parseInt(this.value);
    let v2 = parseInt(this.total) - v1;
    console.log(v1, v2)
    return {
      config: {
        lineWidth : 5,
        data: [
          {name:'资金占比', value:v1},
          {name:'剩余', value:v2},
          ]
      }
    };
  },
}
</script>

<style scoped>
.x {
  background-color: #001c35; flex:1; padding: 3px; margin: 1px;
}
.a {
  color: #da5f04; font-size: 15px; display: inline-block;
}
.b {
  font-size: 10px; float: right; 
}
.c {
  font-size: 15px; color: #24fbf3; display: inline-block;
}
.title {
  color:#eee; display:inline-block
}
.index {
  font-size: 20px; float: right; color: chartreuse;
}
</style>