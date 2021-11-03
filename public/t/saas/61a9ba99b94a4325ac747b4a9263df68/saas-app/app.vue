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
          <mainmenu :list='items'/>
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
const store = new Vuex.Store(require("./store.js"));

let vt = require("cdn/xboson-vue/1.0.0/loader/vuetify.js");
let vuetify = new vt.Vuetify({
  theme: { dark: false },
  icons: {
    iconfont: 'fas',
  },
  lang: {
    current: 'zhHans',
  }
});

const router = new VueRouter({
  routes : [
    { path: '/calendar', component: require("./tasks/calendar/calendar.vue", 1,1) },
    { path: '/test', component: require("./tasks/calendar/default.vue", 1,1) },
    { path: '/test2', component: require("./tasks/calendar/test2.vue", 1,1) },
  ]
});

export default {
  components: {
    'mainmenu': require("./menu.vue", 1, 1),
  },
  
  icons: {
    iconfont: 'mdi', // 默认值 - 仅用于展示目的
  },
  
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
        { text: '子菜单', child: [{ text:'子菜单1', icon: 'mdi-history' }] }
      ],

    }
  },
  
  computed : {
  },
  
  mounted() {
    this.checkLoginState();
  },
  
  methods : {
    checkLoginState() {
      this.$globalBus.on('x-login', ()=>{
        let returnPage = encodeURIComponent(location.href);
        location.href = xv.url_prefix +'/ui/paas/login.html?returnPage='+ returnPage;
      });
    },
  }
}
</script>

<style scoped>
</style>