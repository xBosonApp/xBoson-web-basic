<!-- Create By xBoson System -->

<template>
<transition name="fade">
  <div id='main-frame' v-if='prjid != null' :key='1'>
    <div class='main-menu'>
      <cl-menu :editor-files='editorFiles' :project-name='projectName' @quit='returnChoosePrj'></cl-menu>
    </div>
    <div class='component-choose'>
      <cl-component-choose></cl-component-choose>
    </div>
    <div class='editor'>
      <cl-editor :editor-files='editorFiles'></cl-editor>
    </div>
    <div class='adjustment'>
      <cl-adjustment></cl-adjustment>
    </div>
    <!--<div class='message' v-if='$store.state.message'>{{$store.state.message}}</div>-->
  </div>
  
  <cl-prj v-else @open='openPrject' :key='2'></cl-prj>
</transition>
</template>

<script>
[
  'cl-menu', 
  'cl-adjustment',
  'cl-page-design',
  'cl-prj',
  
  'cl-editor', 
  'cl-component-container',
  'cl-component-container2',
  'cl-component-container3',
  'cl-component-container4',
  'cl-component-choose',
  
  'cl-color-picker',
  'cl-css-number',
  'cl-input-fmt',
  'cl-add-button',
  'cl-adj-context-basic',
  
].forEach(function(name) {
  Vue.component(name, require('./'+ name +'.vue', 1,1));
});


const router = new VueRouter({});
const store = require("./store.js");


export default {
  store,
  router,
  
  data() {
    return {
      prjid : null,
      projectName : '',
      editorFiles : {},
    }
  },
  
  mounted() {
    this.checkLoginState();
  },
  
  methods : {
    openPrject(prj) {
      this.prjid = prj._id;
      this.projectName = prj.name;
      this.$store.commit('setProject', prj);
    },
    
    returnChoosePrj() {
      this.prjid = null;
      this.$store.commit('setProject', null);
    },
    
    checkLoginState() {
      this.$globalBus.on('x-login', ()=>{
        let returnPage = encodeURIComponent(location.href);
        location.href = '../login.html?returnPage='+ returnPage;
      });
    },
  },
}

console.log("上海竹呗信息技术有限公司, 版权所有 http://xboson.net");
</script>

<style scoped lang='less'>
@borderPad: 4px;

#main-frame {
  height: 100%;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  grid-template-rows: 30px calc(100vh - 30px);
  
  .main-menu, .message {
    grid-column: 1 / 4;
  }
  
  .main-menu {
    padding: @borderPad; border-bottom: 1px solid #eee;
  }
  
  .message {
    background-color: #fbf2c8; padding: @borderPad;
  }
  
  .editor {
    border-color: #e8e8e8; border-style: solid; border-width: 0 6px;
    background-color: #e8e8e8;
  }
  
  .adjustment, .editor, .component-choose {
    height: 100%; overflow-y: auto;
  }
}
</style>