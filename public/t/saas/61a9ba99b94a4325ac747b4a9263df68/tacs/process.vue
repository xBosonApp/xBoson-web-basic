<!-- Create By xBoson System -->

<template>
  <div style='margin-bottom: 9px;'>
    <div class='title'>
      <div class='txt'><slot></slot></div>
    </div>
    <div class='p'>
      <div class='v' :style='{ width: w }'></div> 
      <div class='t txt'>{{ value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: -1,
    },
    max: {
      type: Number,
      default: 100,
    },
  },
  
  computed: {
    w() {
      if (this.value < 0) {
        this.value = parseInt(Math.random() * 100);
      }
      return (this.value / this.max) *100 +'%';
    },
  },
}
</script>

<style scoped>
.p {
  border-radius: 2px; opacity: 0.8;
  border-bottom: 1px solid #0d0d99;
  display: grid; padding-bottom: 1px;
  grid-template-columns: 1fr auto;
}
.v {
  background-color: #2424ce; border-radius: 2px; opacity: 0.8;
  background-image: linear-gradient(to right , #2424ce, #6262ef);
  margin: 3px 0;
}
.t {
  font-size: 8px;
}
.title {
  background-color: #050d46; opacity: 0.8;
}
</style>