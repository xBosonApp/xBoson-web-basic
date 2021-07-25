<!-- Create By xBoson System -->

<template>
<div class='items-group m'>
  <div class='content'>
    <a-radio-group v-model="sel_type" button-style="solid">
      <a-radio-button :value="t" v-for='t in types' @click='sel_relu = 0'>{{ t }}</a-radio-button>
    </a-radio-group>
    
    <div class='sp'>
      <b>分辨率</b>
      <span class='note'>(单位: {{ units[sel_type] }})</span>:
    </div>
    
    <a-radio-group v-model='sel_relu' class='rp'>
      <a-radio :value="i" class='rit' v-for='(item, i) in r[sel_type]'>
        <div class='it'>
          <span>{{ item.name }}</span> 
          <span class='note'>{{ item.w }} x {{ item.h }}</span>
        </div>
      </a-radio>
    </a-radio-group>
    
    <a-button-group class='sp'>
      <a-button type="primary" @click='ok'>确定</a-button>
      <a-button @click='cancel'>取消</a-button>
    </a-button-group>
  </div>
  
  <div class='content'>
    <div v-if='hasBorder'>
      <a-radio-group v-model='sel_bord' button-style="solid">
        <a-radio-button :value="i" v-for='(b, i) in MobileBorder'>
          {{ b.name }}
        </a-radio-button>
      </a-radio-group>
      
      <cl-device-emu :setting='deviceSetting' class='sp'>xxx</cl-device-emu>
    </div>
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  // value: v-model
  props: ['value'],
  
  components: tool.loadc('cl-device-emu'),
  
  data() {
    return {
      types: [ 'Destop', 'Mobile', 'Pad' ],
      units: { Destop:'px', Mobile:'pt', Pad:'pt' },
      sel_type: 'Destop',
      sel_relu: 0,
      sel_bord: 0,
        
      r : {
        Destop: [
          { name: '默认',       w:'auto', h:'auto' },
          { name: '4:3 标准',   w:1024, h:768,  },
          { name: '4:3 中',     w:1440, h:1050, },
          { name: '4:3 高',     w:1600, h:1200, },
          { name: '5:4 标准',   w:1280, h:1024, }, 
          { name: '14:9',       w:1600, h:1024, },
          { name: '15:10',      w:1366, h:768,  },
          { name: '16:9',       w:1600, h:900,  },
          { name: '16:9 高',    w:1920, h:1080, },
          { name: '16:10 标准', w:1280, h:800,  },
          { name: '16:10 中',   w:1440, h:900,  },
          { name: '16:10 中高', w:1680, h:1050, },
          { name: '16:10 高',   w:1920, h:1200, },
          { name: '480P',       w: 640, h:480,  },
          { name: '720P',       w:1280, h:720,  },
          { name: '1080P',      w:1920, h:1080, },
          { name: '2K',         w:1152, h:2048, },
          { name: '4K',         w:2304, h:4096, },
          { name: '8K',         w:7680, h:4320, },
        ],
        
        Pad: [
          { name:'iPad 1/2/3/4',w:1024, h:768  },
            { name:'iPad pro',    w:1366, h:1024 },
            { name:'Surface Duo', w: 540, h:720  },
        ],
        
        Mobile : [
          // sh 状态栏高度, nh 导航栏高度
          { name:'华为Mate 20 Pro', w:360, h:780, },
          { name:'华为Mate X2', w:733, h:872, },
          { name:'魅族 16th',   w:360, h:720, },
          { name:'Redmi 8',     w:360, h:732, },
          { name:'OPPO A5',     w:360, h:760, },
          { name:'Vivo S9',     w:360, h:800, },
          { name:'iPhone 4',    w:320, h:480, sh:20, nh:44 },
          { name:'iPhone 5',    w:320, h:568, sh:20, nh:44 },
          { name:'iPhone 6',    w:375, h:667, sh:20, nh:44 },
          { name:'iPhone 7',    w:414, h:736, sh:20, nh:44 },
          { name:'iPhone 8',    w:375, h:667, sh:20, nh:44 },
          { name:'iPhone X',    w:375, h:812, sh:44, nh:44 },
          { name:'iPhone 11',   w:414, h:896, sh:44, nh:44 },
          { name:'iPhone 12',   w:390, h:844, },
          { name:'Galaxy S5',   w:360, h:640, },
          { name:'Galaxy Fold', w:280, h:653, },
          { name:'Pixel 2',     w:411, h:731, },
        ],
      },
      
      MobileBorder: [
        // [x 内容起点左偏移, y 内容起点上偏移, w 内容宽度, h 内容高度]
        { name:'样式1', file:'device/m1m.svg', p:[ 12,  39, 214, 385] },
        { name:'样式2', file:'device/m2m.svg', p:[ 23, 141, 657, 997] },
      ],
    };
  },
  
  computed: {
    resolution() {
      let t = this.r[this.sel_type];
      return t && t[this.sel_relu];
    },
    
    hasBorder() {
      return { 
        'Mobile': true,
      }[this.sel_type] || false;
    },
    
    border() {
      return this.hasBorder ? this.MobileBorder[this.sel_bord] : null;
    },
    
    deviceSetting() {
      return {
        resolution : this.resolution,
        hasBorder  : this.hasBorder,
        border     : this.border,
        unit       : this.units[this.sel_type],
      }
    },
  },
  
  methods : {
    ok() {
      console.log(this.resolution);
      this.$emit('input', this.deviceSetting);
      antd.message.success("页面已更改");
      this.$emit('close');
    },
    
    cancel() {
      this.$emit('close');
    },
  },
}
</script>

<style scoped>
.m {
  grid-template-columns: 1fr 1fr;
}
.rp {
  display: grid; grid-template-columns: 1fr 1fr; gap: 3px 30px;
}
.it {
  display: inline-flex; flex-direction: row; justify-content: space-between; width: calc(100% - 40px);
}
.rit { border-bottom: 1px dashed #fff; }
.rit:hover { border-bottom: 1px dashed #eee; }
.sp {
  margin-top: 20px;
}
</style>