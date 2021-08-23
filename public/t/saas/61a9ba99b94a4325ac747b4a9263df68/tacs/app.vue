<template>
<div class='main'>
  <router-view></router-view>
</div>
</template>

<script>
const store = new Vuex.Store(require("./store.js"));

const defaultPage = require("./p1.vue", 1,1);

const pageList = ['p1', 'p2', 'p3', 'p4'];

const router = new VueRouter({
  routes : makerouter(pageList, [{ path: '/', component: defaultPage }]),
});

const globalComponent = [
  'bk', 'xtitle', 'rowcol', 'rowrow', 'colcol', 'colrow', 'dialog-data'
];

globalComponent.forEach(n=>{
  Vue.component(n, require("./"+ n +".vue", 1, 1));  
});


export default {
  props : [],
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

function makerouter(arr, _routes) {
  let routes = _routes || [];
  arr.forEach(p=>{
    routes.push({
      path : '/'+ p,
      component : require("./"+ p +".vue", 1,1),
    });
  });
  return routes;
}
</script>

<style lang='less'>
#dv-full-screen-container {
  display: flex; flex-flow: column;
  
  .border {
    border: 0!important;
  }
  
  .el-row {
    padding-top: 20px;
  }
  
  .el-col .el-row:first-child {
    padding-top: 0;
  }
  
  h4, h1, h2, h3 {
    color: #eee; padding: 0;
  }
  
  .content {
    height: calc(100% - 40px); 
  }
  
  .border-box-content {
    padding: 7px 20px;
  }
}

* {
  color: #bbb;
}
div, span, a {
  font-size: smaller;
}
.txt {
  background: -webkit-linear-gradient(#fff,#b5a5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /*text-shadow: 1px 1px 3px #999;*/
}
.main {
  height: 100%; width: 100%; background-color: #2a2953;
}
table {
  width: 100%; background-color: #07146d;
  
  tr:nth-child(even) {
    background-color: #0c0c46;
  }
}
</style>