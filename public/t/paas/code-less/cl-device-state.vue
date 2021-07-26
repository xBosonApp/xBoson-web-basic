<!-- Create By xBoson System -->

<template>
  <div class='state'>
    <div>{{ time }}</div>
    <i class='fas fa-signal'></i>
    <i class='fas fa-wifi'></i>
    <i :class='battery[bidx]'></i>
  </div>
</template>

<script>
const fa = require("cdn/fontawesome/5.15.3/css/all.min.css", 1);

export default {
  data() {
    return {
      tid  : null,
      btid : null,
      bidx : 0,
      time : '',
      
      battery: [
        'fas fa-battery-full', 
        'fas fa-battery-three-quarters', 
        'fas fa-battery-half',
        'fas fa-battery-quarter', 
        'fas fa-battery-empty'
      ],
    };
  },
  
  mounted() {
    this.btid = setInterval(this.upbatt, 30 * 60 * 1000);
    this.tid = setInterval(this.uptime, 30 * 1000);
    this.uptime();
  },
  
  beforeDestroy() {
    clearInterval(this.tid);
    clearInterval(this.btid);
  },
  
  methods: {
    uptime() {
      let d = new Date();
      let m = 1+d.getMinutes();
      if (m < 10) m = '0'+ m;
      this.time = d.getHours() +':'+ m;
    },
    
    upbatt() {
      if (++this.bidx >= this.battery.length-1) {
        clearInterval(this.btid);
      }
    },
  },
}
</script>

<style scoped>
.state {
  display: grid; grid-template-columns: 1fr auto auto auto; gap: 0 8px; font-size: 18px; font-weight: bold;
  background-color: #f5f5f5; padding: 0 5px;
}
.state i {
  line-height: inherit; 
}
</style>