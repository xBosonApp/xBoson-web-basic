<template>
<div>
  <h1>列车自主运行系统</h1>
</div>
</template>

<script>
const store = new Vuex.Store(require("./store.js"));

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
  router,
  store,
  data () {
    return {
    }
  },
  
  components: {
    // 'content-comp': require('./home.vue', 1, 1),
  },
  
  computed : {
  },
  
  mounted() {
    this.checkLoginState();
  },
  
  methods : {
    error(err) {
      xv.popError("错误", err);
    },

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