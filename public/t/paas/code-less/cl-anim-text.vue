<!-- Create By xBoson System -->

<template>
  <span ref='textdom' style='display: inline-block'>{{ value }}</span>
</template>

<script>
export default {
  props: {
    // 要显示的内容, 变化后呈现动画
    value: String,
    // 动画名, 参考: https://animate.style/
    anim : String,
  },
  
  computed: {
    animateName() {
      if (!this.anim) {
        return 'animate__rubberBand';
      }
      if (this.anim.startsWith('animate__')) {
        return this.anim;
      }
      return 'animate__'+ this.anim;
    },
  },
  
  watch: {
    'value': function() {
      this.addAnim();
    },
  },
  
  mounted() {
    this.$refs.textdom.addEventListener("animationend", this.removeAnim);
    this.addAnim();
  },
  
  beforeDestroy() {
    this.$refs.textdom.removeEventListener('animationend', this.removeAnim);
  },
  
  methods: {
    removeAnim() {
      let d = this.$refs.textdom;
      d.classList.remove('animate__animated');
      d.classList.remove(this.animateName);
    },
    
    addAnim() {
      let d = this.$refs.textdom;
      d.classList.add('animate__animated');
      d.classList.add(this.animateName);
    },
  },
}
</script>

<style scoped>
</style>