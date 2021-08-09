<template>
  <v-app>
    <v-app-bar app>
      <!--<v-toolbar prominent src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">-->
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>标题栏</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>menu</v-icon>
        </v-btn>
      <!--</v-toolbar>-->
    </v-app-bar>
    <v-main>
      <router-link to="/default">跳转到 default</router-link>
      
      <v-container fluid>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
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
require("cdn/fontawesome/5.15.3/css/all.min.css");
let vuetify = new vt.Vuetify({
  theme: { dark: false },
  icons: {
    iconfont: 'fa',
    values: {
      cancel: 'fas fa-ban',
      menu: 'fas fa-ellipsis-v',
    },
  },
});

const router = new VueRouter({
  routes : [
    { path: '/default', component: require("./default.vue", 1,1) },
  ]
});

export default {
  props : ['content'],
  vuetify,
  router,
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