<template>
  <el-container>
    <x-menu2 @openSubMenu='openSubMenu' :hideAll='hideAllMenu' title='xBoson 大数据 UI'>
      <template v-slot:main>
        <el-menu-item index='element'>Element UI</el-menu-item>
        <el-menu-item index='ant'>Ant Design Vue</el-menu-item>
        <el-menu-item index='boot'>Bootstrap Vue</el-menu-item>
        <el-menu-item index='bigscreen'>大屏演示</el-menu-item>
        <el-menu-item index='echarts'>图表演示</el-menu-item>
        <el-menu-item index='other'>杂项</el-menu-item>
      </template>
      <template v-slot:sub>
        <component :is="subMenuId"></component>
      </template>
    </x-menu2>
    
    <el-container class='content-container' @mouseover.native="hideAllMenu++">
      <el-header class='pagetitle'>
        <h5 class='header-title'>xBoson Modern UI DEMO <a>{{currentTitle}}</a> 
          <small style='color: #ccc; float: right;'>只作为演示, 不可用作开发文档</small>
        </h5>
      </el-header>
      <el-main class='main-content'>
        <content-comp></content-comp>
        <el-backtop target='.main-content'></el-backtop>
      </el-main>
      <!--<el-footer>Footer</el-footer>-->
    </el-container>
  </el-container>
</template>

<script>
[
  'demo-layout', 'doc', 'open-file-menu', 'menu2', 'chart', 'copy', 
  'bs1', 'bs2', 'bs3', 'bs4', 'colcol', 'colrow', 'rowrow', 'rowcol',
  'dv-border-box-undefined',
  
].forEach(function(name) {
  Vue.component(name, require('./modern-app-components/'+ name +'.vue',1,1));
});
// 别名, 方便写代码
Vue.component('demo', require('./modern-app-components/demo-layout.vue', 1,1));

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
      subMenuId : '',
    }
  },
  
  components: {
    'content-comp': require('./default.vue', 1, 1),
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
      let compId = 'sub-menu-comp-'+ id;
      this.$options.components[compId] = mod;
      this.subMenuId = compId;
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
.pagetitle a {
  color: #999;
}
p {
  color: #909090;
}
.content-container {
  padding-left: 150px; 
}
.main-content {
  padding-right: 7%!important;
}
.header-title {
  /*padding-left: 200px;*/ border-bottom: 1px solid #eee;
}
/*.echarts {*/
/*  width: 100%;*/
/*  height: 600px;*/
/*}*/

@media screen and (max-device-width: 660px) {
  .content-container {
    padding-left: 40px; 
  }
}
</style>