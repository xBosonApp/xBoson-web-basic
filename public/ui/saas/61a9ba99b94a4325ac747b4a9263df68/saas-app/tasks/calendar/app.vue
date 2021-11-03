<template>
  <v-app class="mx-auto overflow-hidden">

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
const store = new Vuex.Store(require("../../store.js"));

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
    { path: '/calendar', component: require("./calendar.vue", 1,1) },
  ]
});

export default {
  components: {
    'router-view': require('./calendar.vue', 1, 1),
  },
  icons: {
    iconfont: 'mdi', // 默认值 - 仅用于展示目的
  },
  vuetify,
  router,
  store,
  
  data () {
    return {
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