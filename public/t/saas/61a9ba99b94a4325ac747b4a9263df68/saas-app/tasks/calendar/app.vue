<template>
  <v-app class="mx-auto overflow-hidden">

    <v-app-bar color="primary" app dark dense height="50">
      <v-app-bar-nav-icon @click="drawer = true"><i class='fas fa-bars'></i></v-app-bar-nav-icon>
      <v-toolbar-title>健康管理</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>fa-street-view</v-icon></v-btn>
      <v-btn icon><v-icon>fa-sign-out-alt</v-icon></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="primary--text text--accent-4">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6">艾特日程</v-list-item-title>
              <v-list-item-subtitle>v1.0.0</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon v-text="item.icon" dense></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
              <!--<v-list-item-title v-text="item.text" exact exact-path><router-link :to="item.to">{{item.text}}</router-link></v-list-item-title>-->
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main bottom>
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
let vuetify = new vt.Vuetify({
  theme: { dark: false },
  icons: {
    iconfont: 'fas',
    // values: {
    //   cancel: 'fa fa-ban',
    //   menu: 'fa fa-ellipsis-v',
    // },
  },
  lang: {
    // locales: { 'zhHans' },
    current: 'zhHans',
  }
});
console.log(vuetify,vt);
const router = new VueRouter({
  routes : [
    { path: '/calendar', component: require("./calendar.vue", 1,1) },
    { path: '/test', component: require("./test.vue", 1,1) },
    { path: '/test2', component: require("./test2.vue", 1,1) },
  ]
});

export default {
  icons: {
    iconfont: 'mdi', // 默认值 - 仅用于展示目的
  },
  props : ['content'],
  vuetify,
  router,
  store,
  data () {
    return {
      hideAllMenu : 0,
      subMenuId : '',
      drawer: false,
      group: null,
      selectedItem: 0,
      items: [
        { text: '【日历】总览', to: '/calendar', icon: 'fa-calendar-alt' },
        { text: '成员管理', to: '', icon: 'fa-user' },
        { text: '客户管理', to: '', icon: 'fa-users' },
        { text: '测试1', to: '/test', icon: 'mdi-history' },
        { text: '测试2', to: '/test2', icon: 'mdi-check-circle' },
      ],

    }
  },
  
  components: {
    'content-comp': require('./calendar.vue', 1, 1),
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
  
  mounted() {
    this.checkLoginState();
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
    checkLoginState() {
      this.$globalBus.on('x-login', ()=>{
        let returnPage = encodeURIComponent(location.href);
        location.href = xv.url_prefix +'/ui/paas/login.html?returnPage='+ returnPage;
      });
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