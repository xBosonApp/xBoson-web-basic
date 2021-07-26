<!-- Create By xBoson System -->

<template>
  <div ref='main' class='main' :style='{ height: contenth  +"px" }'>
    <img class='im' :src='setting.border.file' :style='imgStyle' ref='img' @load='onImgLoad'/>
    <div class='ct' :style='contentStyle'>
      <cl-device-state />
      <div class='body' :style="{ height: bodyh +'px' }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
const tool = require('./tool.js');

export default {
  // setting: {
  //   border: { name, file, p:[x, y, w, h] }
  //   resolution: { name, w, h }
  //   unit
  //   index: { sel_scale }
  // }
  props: ['setting'],
  
  components: tool.loadc('cl-device-state'),
  
  watch: {
    'setting': function() {
      this.upContentStyle();
    },
  },
  
  data() {
    return {
      contentStyle : {},
      imgStyle : {},
      iw : 0,
      ih : 0,
      contenth : 0,
      
      battery: [
        'fas fa-battery-full', 
        'fas fa-battery-three-quarters', 
        'fas fa-battery-half',
        'fas fa-battery-quarter', 
        'fas fa-battery-empty'
      ],
    };
  },
  
  methods: {
    onImgLoad() {
      this.imgStyle = { width: 'auto', height: 'auto' };
      this.$nextTick(()=>{
        if (!this.$refs.img) return;
        this.iw = this.$refs.img.width;
        this.ih = this.$refs.img.height;
        this.upContentStyle();
      });
    },
    
    // 必须在渲染完成后调用
    upContentStyle() {
      const st = this.setting;
      let [x, y, w, h] = st.border.p;
      let rw = st.resolution.w;
      let rh = st.resolution.h;
      let ratex = rw / w;
      let ratey = rh / h;
      let scaleSty = { 'transform-origin' : 'left top' };
      let scale = st.index.sel_scale / 100;
      
      if (scale > 0) {
        scaleSty.transform = 'scale('+ scale +')';
      }
      
      Object.assign(this.imgStyle, {
        width  : this.iw * ratex +'px',
        height : this.ih * ratey +'px',
        // opacity: '0.3',
      }, scaleSty);
      
      Object.assign(this.contentStyle, {
        left   : x*ratex*scale + 'px',
        top    : y*ratey*scale + 'px',
        width  : rw + 'px',
        height : rh + 'px',
      }, scaleSty);
      
      this.contenth = Math.round(this.ih * ratey * scale) + 3;
      this.bodyh = rh;
    },
  },
}
</script>

<style scoped>
.main {
  position: relative;
}
.im, .ct {
  position: absolute; /*border: 1px dashed #ccc;*/
}
.body {
  background-color: white; overflow: auto;
}
</style>