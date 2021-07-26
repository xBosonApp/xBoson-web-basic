<!-- Create By xBoson System -->

<template>
<div class='items-group m'>
  <div class='content'>
    <div class='it' style='width: calc(100% - 25px);'>
      <a-radio-group v-model="sel_type" button-style="solid">
        <a-radio-button :value="t" v-for='t in types' @click='sel_relu = 0'>{{ t }}</a-radio-button>
      </a-radio-group>
      
      <a-radio-group v-model='sel_bord' button-style="solid" v-if='hasBorder'>
        <a-radio-button :value="i" v-for='(b, i) in MobileBorder'>
          {{ b.name }}
        </a-radio-button>
      </a-radio-group>
    </div>
    
    <div class='sp'>
      <b>分辨率</b>
      <span class='note'>(单位: {{ units[sel_type] }})</span>:
    </div>
    
    <a-radio-group v-model='sel_relu' class='rp'>
      <a-radio :value="i" class='rit' v-for='(item, i) in r[sel_type]'>
        <div class='it' v-if='!item.userdef'>
          <span>{{ item.name }}</span> 
          <span class='note'>{{ item.w }} x {{ item.h }}</span>
        </div>
        
        <div class='it' v-else>
          <span>{{ item.name }}</span> 
          <span class='note'>
            <a-input v-model='item.w' placeholder="宽" size="small" class='riti'/> x 
            <a-input v-model='item.h' placeholder="高" size="small" class='riti'/>
          </span>
        </div>
      </a-radio>
    </a-radio-group>
    
    <div class='items-group' style='grid-template-columns: 1fr auto;'>
      <a-slider v-model='sel_scale' :min='10' :max='300' 
        :step='5' style='flex-grow:1'
        :tip-formatter="formatterScale"/>
      <a-button @click='sel_scale = 100' size='small'
        icon='undo' style='margin-top: 8px' type='link'></a-button>
    </div>
    
    <a-button-group class='sp'>
      <a-button type="primary" @click='ok'>确定</a-button>
      <a-button @click='cancel'>取消</a-button>
    </a-button-group>
    
    <a-checkbox v-model='setToDefault' style='margin-left: 30px'>
      <span v-if='setToDefault'>同时设置为全局默认页面配置</span>
      <span v-else>当前文件页面配置</span>
    </a-checkbox>
  </div>
  
  <div class='content' style='padding-top: 0'>
    <div v-if='hasBorder'>
      <cl-device-emu :setting='deviceSetting' class='sp'>
        <cl-anim-demo :width='resolution.w' :height='resolution.h' />
      </cl-device-emu>
    </div>
    
    <div v-else class='items-group' style='grid-template-columns: 1fr auto'>
      <div>
        <span>{{ resolution.w }} {{ units[sel_type] }}</span>
        <span class='note' v-if='!isNaN(resolution.w)'>
          {{ resolution.w * sel_scale / 100 }} {{ units[sel_type] }}
        </span>
      </div>
      <div></div>
      <div :style='borderStyle' class='cl-background-flanel-lines' ref='vscreen'></div>
      <div style='min-width: 10em;'>
        <div>{{ resolution.h }} {{ units[sel_type] }}</div>
        <div class='note' v-if='!isNaN(resolution.h)'>
          {{ resolution.h * sel_scale / 100 }} {{ units[sel_type] }}
        </div>
      </div>
      <div class='note'>{{ sel_scale }}%</div>
    </div>
  </div>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  // value: v-model
  props: ['value'],
  
  components: tool.loadc('cl-device-emu', 'cl-anim-demo'),
  
  data() {
    return {
      types: [ 'Destop', 'Mobile', 'Pad' ],
      units: { Destop:'px', Mobile:'pt', Pad:'pt' },
      setToDefault: false,
      
      sel_type: 'Destop',
      sel_relu: 0,
      sel_bord: 0,
      sel_scale: 100,
        
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
          { name: '2K',         w:2048, h:1152, },
          { name: '4K',         w:4096, h:2304, },
          { name: '8K',         w:7680, h:4320, },
          { name: '自定义',     w: 300, h: 185, userdef:true },
        ],
        
        Pad: [
          { name:'iPad 1/2/3/4',w: 768, h:1024  },
          { name:'iPad pro',    w:1024, h:1366  },
          { name:'Surface Duo', w: 540, h:720   },
        ],
        
        Mobile : [
          // sh 状态栏高度, nh 导航栏高度
          { name:'华为Mate 20 Pro', w:360, h:780, },
          { name:'魅族 16th',   w:360, h:720, },
          { name:'Redmi 8',     w:360, h:732, },
          { name:'OPPO A5',     w:360, h:760, },
          { name:'Vivo S9',     w:360, h:800, },
          { name:'华为Mate X2', w:733, h:872, },
          { name:'iPhone 4',    w:320, h:480, sh:20, nh:44 },
          { name:'iPhone 5',    w:320, h:568, sh:20, nh:44 },
          { name:'iPhone 6/8',  w:375, h:667, sh:20, nh:44 },
          { name:'iPhone 7',    w:414, h:736, sh:20, nh:44 },
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
        { name:'样式1', file:'device/m1m.svg', p:[ 12,  38, 215, 373] },
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
        resolution : Object.assign({}, this.resolution),
        hasBorder  : this.hasBorder,
        border     : this.border,
        unit       : this.units[this.sel_type],
        index : { // 设置恢复时的查询条件
          sel_type : this.sel_type,
          sel_relu : this.sel_relu,
          sel_bord : this.sel_bord,
          sel_scale: this.sel_scale,
        },
      }
    },
    
    borderStyle() {
      let vs = this.$refs.vscreen;
      let width = vs ? (vs.clientWidth) : 500;
      let height = width * ((this.resolution.h / this.resolution.w) || 0.63);
      return {
        border : '1px dashed #999',
        // width  : width +'px',
        height : height +"px",
      }
    },
  },
  
  mounted() {
    this.initIndex();
  },
  
  methods : {
    initIndex() {
      let index = this.value && this.value.index;
      if (!index) {
        let dps = this.$store.state.defaultPageSetting;
        index = dps && dps.index;
      }
      if (index) {
        for (let n in index) {
          this[n] = index[n];
        }
        if (this.value.resolution.userdef) {
          Object.assign(this.r[index.sel_type][index.sel_relu], this.value.resolution);
        }
      }
    },
    
    ok() {
      if (this.setToDefault) {
        this.$store.commit('setDefaultPageSetting', this.deviceSetting);
      }
      this.$emit('input', this.deviceSetting);
      antd.message.success("页面已更改");
      this.$emit('close');
    },
    
    cancel() {
      this.$emit('close');
    },
    
    formatterScale(v) {
      return '缩放比率 '+ v +"%";
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
.riti { width: 5em }
</style>