<!-- Create By xBoson System -->

<template>
  <div class='f bk animate__animated animate__flipInX' ref='bk'></div>
</template>

<script>
export default {
  props: ['img'],
  
  data() {
    return {};
  },
  
  mounted() {
    this.bindMove();
    this.$refs.bk.style.backgroundImage = 'url("'+ this.img +'")';
  },
  
  beforeDestroy() {
    this.unbindMove();
  },
  
  methods: {
    bindMove() {
      document.body.addEventListener('mousemove', this.move);
    },
    
    unbindMove() {
      document.body.removeEventListener('mousemove', this.move);
    },
    
    move(e) {
      let px = e.screenX / screen.width;
      let py = e.screenY / screen.height;
      px = (px/10) * 100+'%';
      py = (py/10) * 100+'%';
      // console.log(px, py)
      this.$refs.bk.style.backgroundPosition = px +' '+ py;
    },
  },
}
</script>

<style scoped>
.bk {
  /*background-image: url('img/bk2.jpeg');*/
  background-repeat: no-repeat; 
  background-size: 110% 110%;
  opacity: 0.3;
  position: fixed; width: 100%; height: 100%; top:0; left:0;
}
</style>