<!-- Create By xBoson System -->

<template>
  <div ref='main' class='main'>
    <img class='im' :src='setting.border.file' :style='imgStyle' ref='img' @load='onImgLoad'/>
    <div class='ct' :style='contentStyle'>
      <div class='state'>
        <div>{{ time }}</div>
        <i class='fas fa-signal'></i>
        <i class='fas fa-wifi'></i>
        <i :class='battery[bidx]'></i>
      </div>
      <div class='cc'>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
const fa = require("cdn/fontawesome/5.15.3/css/all.min.css", 1);

export default {
  // setting: {
  //   border: { name, file, p:[x, y, w, h] }
  //   resolution: { name, w, h }
  //   unit
  // }
  props: ['setting'],
  
  watch: {
    'setting': function() {
      this.upContentStyle();
    },
  },
  
  data() {
    return {
      tid  : null,
      btid : null,
      bidx : 0,
      time : '',
      contentStyle : {},
      imgStyle : {},
      iw : 0,
      ih : 0,
      
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
    this.tid = setInterval(this.uptime, 10 * 1000);
    this.uptime();
  },
  
  beforeDestroy() {
    clearInterval(this.tid);
    clearInterval(this.btid);
  },
  
  methods: {
    onImgLoad() {
      this.imgStyle = { width: 'auto', height: 'auto' };
      this.$nextTick(()=>{
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
      
      Object.assign(this.imgStyle, {
        width  : this.iw * ratex +'px',
        height : this.ih * ratey +'px',
      });
      
      Object.assign(this.contentStyle, {
        left   : x*ratex + 'px',
        top    : y*ratey + 'px',
        width  : rw + 'px',
        height : rh + 'px',
      });
    },
    
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
.main {
  position: relative;
}
.im, .ct {
  position: absolute; /*border: 1px dashed #ccc;*/
}
.state {
  display: grid; grid-template-columns: 1fr auto auto auto; gap: 0 8px; font-size: 18px; font-weight: bold;
  background-color: #f5f5f5; padding: 0 5px;
}
.state i {
  line-height: inherit; 
}
.cc {
  background-color: white;
}
</style>