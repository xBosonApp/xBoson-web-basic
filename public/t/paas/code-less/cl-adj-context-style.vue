<!-- Create By xBoson System -->

<template>
<div>
  <cl-adj-context-basic
    :value='value'
    pname='样式'
    pid='s_'
    configTitle='上下文样式'
    configComponent='cl-style-adj'
    :initItem='initItem'
    :createConfigData='createConfigData'
    :maskStyle="{ 'background-color': 'rgba(0,0,0,0)' }"
    :bodyNoPadding='true'
    @close-config='configClose'
    @change='onChange'
  >
    <template v-slot:header='pd'> <!-- pd 是动态创建的对象, 由子节点的 slot 绑定附加属性 -->
      <a-tooltip title='复制' placement='bottom'>
        <a-button size='small' icon='copy' @click='copy(pd)'></a-button>
      </a-tooltip>
      <a-tooltip title='粘贴' placement='bottom'>
        <a-button size='small' icon='highlight' :disabled='cannotPaste' @click='paste(pd)'></a-button>
      </a-tooltip>
    </template>
  </cl-adj-context-basic>
</div>
</template>

<script>
const tool = require("./tool.js");

export default {
  props: ['value'],
  
  data() {
    return {
      delayUpdateStyle : tool.delayWorker(this.updateStyle, 500),
    }
  },
  
  watch : {
    value() {
      this.updateStyle();
    }
  },
  
  computed: {
    cannotPaste() {
      return this.$store.state.cssClipboard == null;
    }
  },
  
  methods: {
    initItem(opt) {
      opt.val = {};
      opt.prefix = '.';
    },
    
    createConfigData(opt, id) {
      return { styleVal: opt.val, id };
    },
    
    copy(pd) {
      this.$store.commit('setCssClipboard', pd.configData.styleVal);
    },
    
    paste(pd) {
      let src = this.$store.state.cssClipboard;
      if (!src) return;
      
      let tar = pd.configData.styleVal;
      for (let n in src) {
        this.$set(tar, n, src[n]);
      }
    },
    
    configClose(cd) {
      this.updateStyle();
    },
    
    onChange() {
      this.delayUpdateStyle();
      this.$store.commit('setEditFileChanged', true);
    },
    
    updateStyle() {
      let cs = this.$store.getters.contextStyle;
      cs.render(this.value);
    },
  },
}
</script>

<style scoped>
</style>