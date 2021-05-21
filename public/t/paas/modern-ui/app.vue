<template>
  <el-container>
    <menu2 @openSubMenu='openSubMenu' :hideAll='hideAllMenu' title='xBoson 大数据 UI'>
      <template v-slot:main>
        <el-menu-item index='element'>Element UI</el-menu-item>
        <el-menu-item index='bigscreen'>大屏演示</el-menu-item>
        <el-menu-item index='report'>报表演示</el-menu-item>
      </template>
      <template v-slot:sub>
        <sub-menu-comp></sub-menu-comp>
      </template>
    </menu2>
    
    <el-container class='content-container' @mouseover.native="hideAllMenu++">
      <el-header class='pagetitle'>
        <h1>xBoson Modern UI DEMO <a>{{currentTitle}}</a> 
          <small style='color: #ccc; float: right;'>只作为演示, 不可作为开发文档</small>
        </h1>
      </el-header>
      <el-main>
        <content-comp></content-comp>
      </el-main>
      <!--<el-footer>Footer</el-footer>-->
    </el-container>
  </el-container>
</template>

<script>
[
  'demo-layout', 'doc', 'open-file-menu', 'menu2',
  
].forEach(function(name) {
  Vue.component(name, require('./modern-app-components/'+ name +'.vue'));
});

const store = new Vuex.Store({
  state: {
    contentPath : null,
    contentId : '.',
  },
  mutations: {
    changeContent(state, d) {
      state.contentPath = d.path;
      state.contentId = d.id;
    }
  },
})

export default {
  props : ['content'],
  store,
  data () {
    return {
      hideAllMenu : 0,
    }
  },
  
  computed : {
    currentTitle() {
      let path = this.$store.state.contentPath;
      if (path) {
        let mod = require(path);
        this.$options.components['content-comp'] = mod;
      }
      
      let id = this.$store.state.contentId;
      return id[0].toUpperCase() + id.substr(1);
    },
  },
  
  methods : {
    openSubMenu(id) {
      let path = './'+ id +'/index.vue';
      let mod = require(path);
      this.$options.components['sub-menu-comp'] = mod;
      this.$forceUpdate();
    },
  }
}
</script>

<style>
h3 { padding-top: 60px; }
.el-container {
  height: 100%;
}
.el-menu-item-group__title {
  color: #85c126!important;
  border-bottom: 1px dotted #c1a06f;
}
.pagetitle h1 {
  border-bottom: 1px solid #eee;
}
.pagetitle a {
  color: #999;
}
p {
  color: #909090;
}
.content-container {
  padding-left: 150px;
}
</style>