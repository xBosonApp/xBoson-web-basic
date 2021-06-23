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
    <div class='message'>{{$store.state.message}}</div>
  </div>
  
  <cl-prj v-else @open='openPrject' :key='2'></cl-prj>
</transition>
</template>

<script>
[
  'cl-menu', 
  'cl-adjustment',
  'cl-page-design',
  'cl-style-adj',
  'cl-prj',
  'cl-file-manager',
  'cl-create-file',
  'cl-open-file',
  
  'cl-editor', 
  'cl-component-container',
  'cl-component-choose',
  
  'cl-icon-select',
  'cl-color-picker',
  'cl-css-number',
  'cl-input-fmt',
  
].forEach(function(name) {
  Vue.component(name, require('./'+ name +'.vue', 1,1));
});


const store = require("./store.js");

export default {
  store,
  
  data() {
    return {
      prjid : null,
      projectName : '',
      editorFiles : {},
    }
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
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to, .fade-leave-active /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.note {
  color: #ccc; 
}
</style>