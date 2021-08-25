<!-- Create By xBoson System -->
<!-- http://xboson.net -->
<!-- Wed Aug 25 2021 14:38:37 GMT+0800 (CST) -->
<template>
<component :is='rootComponent' class='mx'>
<div class='mx animate__animated animate__fadeInDown' v-if='showLogin'>
  <component is='_$_login_page' :title='appName'>
    <div>没有设置登陆页面</div>
  </component>
</div>
<div class='mx animate__animated animate__fadeInDown' :class='{mainf: !doNotShowMainMenu}' v-else>
  <div class='m mx mf' v-if='!doNotShowMainMenu'>
    <sidebar-menu 
      :menu="menu" 
      :theme="theme"
      :width="width"
      :relative='false'
      class='menu'
      @item-click="onJump"
    />
  </div>
  <div class='content-frame m mx'>
    <component is='_$_page_head'></component>
    <router-view></router-view>
  </div>
  
  <x-api org='a297dfacd7a84eab9656675f61750078'
    app='19cb7c3b79e949b88a9c76396854c2b1'
    mod='prjmgr' api='roleslist' 
    @success='setRolesList' />
</div>
</component></template><style scoped>
.mx { height: 100%; }
.mainf { display: grid; grid-template-columns: auto 1fr; }
.content-frame { width: 100%; }
.menu { width: 300px; position: static; }
.m { overflow: auto; }
.mf { border-right: 3px solid #eee; }
</style><script>
var theme = null;
var rootComponent = "div";
var loginPage = null;
var headPage = null;
const importsjs = ["cdn/vue-sidebar-menu/4.8.1/vue-sidebar-menu.js"];
const importscss = ["cdn/fontawesome/5.15.3/css/all.min.css","cdn/vue-sidebar-menu/4.8.1/vue-sidebar-menu.css","cdn/animate.css/4.1.1/animate.min.css"];
theme = "white-theme";
const appName = "放疗随访问卷";
const menu = [{"header":true,"title":"放疗随访问卷"},{"title":"放疗随访问卷1","href":null,"icon":"fas fa-apple-alt","child":[{"title":"病人随访表（头颈部）","href":{"name":"nm1"},"icon":"fas fa-binoculars","child":null,"roles":[],"id":"nm1"}],"roles":[]},{"title":"标题2","href":null,"child":[{"title":"病人随访表（头颈部）","href":{"name":"nm1"},"icon":"fas fa-binoculars","child":null,"roles":[],"id":"nm1"}],"roles":[]},{"title":"标题3","href":null,"child":[{"title":"病人随访表（头颈部）","href":{"name":"nm1"},"icon":"fas fa-binoculars","child":null,"roles":[],"id":"nm1"}],"roles":[]},{"title":"标题4","href":null,"child":[],"roles":[]},{"title":"退出系统","href":{"logout":true},"icon":"fas fa-power-off"}];
const jump = [
  { path: "/page1", name: "nm1", component: require("../FbG5nukSRAGThOLpmaMjXg.vue", 1,1) },
];
const store = new Vuex.Store(require('./store.js'));
const router = new VueRouter({ routes: jump });

const url = window.URL ? new URL(location.href) : {};
const js = [];
const css = [];
const components = {};
const pretendVue = {
  component(name, plugin) {
    // components[name] = plugin;
    Vue.set(components, name, plugin);
  }
};

let doNotShowMainMenu = url.searchParams && url.searchParams.has('_dnsmm'); 
let notNeedLoginCheck = url.searchParams && url.searchParams.has('_dncl');

importscss.forEach(f=>{
  require(f, 1).then(c=>{
    css.push(c);
  }).catch(err=>{
    xv.popError("加载样式", err);
  });
});

importsjs.forEach(f=>{
  try {
    var lib = require(f);
    lib.install(pretendVue);
    js.push(lib);
  } catch(err) {
    xv.popError("加载脚本", err);
  }
});

if (!loginPage) loginPage = 'cdn/xboson-vue/1.0.0/x-login-page.vue';
components['_$_login_page'] = require(loginPage, 1, 1);

if (!headPage) headPage = 'cdn/xboson-vue/1.0.0/x-null.vue';
components['_$_page_head'] = require(headPage, 1, 1);
 
export default {
  store, router, components,
  
  data() {
    return {
      showLogin : false,
      requires  : { js, css },
      width     : '300px',
      menu      : [],
      roles     : {},
      theme,
      appName,
      rootComponent,
      doNotShowMainMenu,
      notNeedLoginCheck,
    };
  },
  
  mounted() {
    if (!notNeedLoginCheck) {
      this.checkLogin();
    }
  },
  
  methods: {
    onJump(e, item, node) {
      console.debug('link', this.$route.name, this.$route.path, item.href);
      if (item.href && item.href.logout) {
        this.logout();
      }
    },
    
    setRolesList(v) {
      v.roles.forEach(i=>{
        this.roles[i.id] = i.name;
      });
      
      this.filterMenu(menu);
      this.menu = menu;
    },
    
    filterMenu(a) {
      for (let i=0; i<a.length; ++i) {
        let m = a[i];
        if (this.blockAuth(m.roles)) {
          a.splice(i, 1);
          --i;
          console.debug("Remove no auth menu", m.title);
          continue;
        }
        if (m.isContainer) {
          this.filterMenu(m.child);
        }
      }
    },
    
    blockAuth(r) {
      if (!r) return false;
      if (r.length <= 0) return false;
      
      for (let i=0; i<r.length; ++i) {
        if (this.roles[r[i]]) return false;
      }
      return true;
    },
    
    checkLogin() {
      this.$globalBus.on('x-login', ()=>{
        this.showLogin = true;
      });
      this.$globalBus.on('x-login-success', ()=>{
        this.showLogin = false;
      });
      this.$globalBus.on('x-logout', this.logout);
    },
    
    logout() {
      let over = ()=>this.$globalBus.emit('x-login');
      this.$xapi(xv.ctx_prefix +'/user/logout', {}).then(over).catch(over);
    },
  },
}</script>