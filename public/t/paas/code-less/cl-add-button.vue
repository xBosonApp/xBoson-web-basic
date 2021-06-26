<!-- Create By xBoson System -->

<template>
  <a-button 
      style='width: 100%'
      type="" 
      size='small' 
      @click='click'
      @mouseover='showAddTip = true'
      @mouseout="showAddTip = false">
    <transition 
      enter-active-class="animate__animated animate__fadeIn" 
      leave-active-class="animate__animated animate__fadeOut" 
      mode="out-in">
      <span v-if='showAddTip && title' class='block'>{{title}}</span>
      <a-icon v-else type='plus' class='block'/>
    </transition>
  </a-button>
</template>

<script>
export default {
  props : ['title'],
  
  data() {
    return {
      showAddTip: false,
    };
  },
  
  methods : {
    click(e) {
      this.$emit('click', e);
    },
  },
}
</script>

<style scoped>
.block { display: block }
.animate__animated.animate__fadeIn, .animate__fadeOut {
  --animate-duration: 0.2s;
}
</style>