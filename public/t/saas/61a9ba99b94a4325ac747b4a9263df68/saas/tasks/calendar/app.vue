<template>
  <v-app>
    <v-app-bar app>
      <!--<v-toolbar prominent src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">-->
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>标题栏</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-export</v-icon>
        </v-btn>
      <!--</v-toolbar>-->
    </v-app-bar>
    <v-main>
      <v-container fluid>
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
      </v-container>
    </v-main>
    
    <v-footer app>
       
    </v-footer>
  </v-app>
</template>

<script>
// [
//   'demo-layout', 'doc', 'open-file-menu', 'menu2', 'chart', 'copy', 
//   'bs1', 'bs2', 'bs3', 'bs4', 'colcol', 'colrow', 'rowrow', 'rowcol',
//   'dv-border-box-undefined',
  
// ].forEach(function(name) {
//   Vue.component(name, require('./modern-app-components/'+ name +'.vue',1,1));
// });
// // 别名, 方便写代码
// Vue.component('demo', require('./modern-app-components/demo-layout.vue', 1,1));

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

let vt = require("cdn/xboson-vue/1.0.0/loader/vuetify.js");

let vuetify = new vt.Vuetify({
  theme: { dark: false },
});

export default {
  props : ['content'],
  vuetify : vuetify,
  store,
  data () {
    return {
      hideAllMenu : 0,
      subMenuId : '',
    }
  },
  
  components: {
    // 'content-comp': require('./default.vue', 1, 1),
  },
  
  computed : {
    // currentTitle() {
    //   let path = this.$store.state.contentPath;
    //   if (path) {
    //     let mod = require(path);
    //     this.$options.components['content-comp'] = mod;
    //   }
      
    //   let id = this.$store.state.contentId;
    //   return id[0].toUpperCase() + id.substr(1);
    // },
  },
  
  methods : {
    // openSubMenu(id) {
    //   let path = './'+ id +'/index.vue';
    //   let mod = require(path);
    //   let compId = 'sub-menu-comp-'+ id;
    //   this.$options.components[compId] = mod;
    //   this.subMenuId = compId;
    //   this.$forceUpdate();
    // },
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