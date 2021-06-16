<!-- Create By xBoson System -->

<template>
  <div id='main-frame'>
    <div class='main-menu'>
      <cl-menu></cl-menu>
    </div>
    <div class='component-choose'>
      <cl-component-choose></cl-component-choose>
    </div>
    <div class='editor'>
      <cl-editor></cl-editor>
    </div>
    <div class='adjustment'>
      <cl-adjustment></cl-adjustment>
    </div>
    <div class='message'>{{$store.state.message}}</div>
  </div>
</template>

<script>
[
  'cl-menu', 
  'cl-adjustment',
  'cl-page-design',
  'cl-style-adj',
  
  'cl-editor', 
  'cl-component-container',
  'cl-component-choose',
  
  'cl-icon-select',
  'cl-color-picker',
  'cl-css-number',
  
].forEach(function(name) {
  Vue.component(name, require('./'+ name +'.vue', 1,1));
});


const store = new Vuex.Store({
  state: {
    showDropTip: true,
    message: '',
    currentAdjustmentComponentConfig: null,
  },
  
  mutations: {
    closeDropTip(state) {
      state.showDropTip = false;
    },
    
    setAdjustmentComponent(s, cfg) {
      s.currentAdjustmentComponentConfig = cfg;
    },
    
    setMessage(s, msg) {
      s.message = msg;
    },
  }
});


export default {
  store,
}

console.log("上海竹呗信息技术有限公司, 版权所有 http://xboson.net");
</script>

<style scoped lang='less'>
@borderPad: 4px;

#main-frame {
  height: 100%;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  grid-template-rows: 30px calc(100vh - 60px) 30px;
  
  .main-menu, .message {
    grid-column: 1 / 4;
  }
  
  .main-menu {
    background-color: #f6faff; padding: @borderPad;
  }
  
  .message {
    background-color: #fbf2c8; padding: @borderPad;
  }
  
  .editor {
    border-left: 1px dashed #e8e8e8; border-right: 1px dashed #e8e8e8;
  }
  
  .adjustment, .editor, .component-choose {
    height: 100%; overflow-y: auto;
  }
}
</style>