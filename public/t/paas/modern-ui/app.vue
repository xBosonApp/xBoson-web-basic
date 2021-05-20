<template>
  <el-container>
    <transition name="menu-rev">
      <el-aside class='menu1' v-show='!showMainMenu' width='50px'
        @mouseover.native='menu1enter=true'
        @click.native='menu1enter=true, menu2enter=false'>
      </el-aside>
    </transition>
    <transition name="menu">
      <el-aside class='menu1' v-show='showMainMenu' >
        <el-menu  background-color="#2b2b2b"
                  text-color="#cccccc"
                  active-text-color="#ffd04b"
                  @select='openSubMenu'>
          <el-menu-item index='element'>Element UI</el-menu-item>
          <el-menu-item index='bigscreen'>大屏演示</el-menu-item>
          <el-menu-item index='report'>报表演示</el-menu-item>
        </el-menu>
      </el-aside>
    </transition>
    
    <transition name="menu-rev">
      <el-aside class='menu2' v-show="!showSubMenu"
          @click.native='menu2enter=true, menu1enter=false'
          @mouseover.native='menu2enter=true' width='50px'>
      </el-aside>
    </transition>
    <transition name="menu">
      <el-aside class='menu2' v-show="showSubMenu">
        <sub-menu-comp></sub-menu-comp>
      </el-aside>
    </transition>
    
    <el-container @mouseover.native="menu1enter=false, menu2enter=false">
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
Vue.component('demo-layout', require('./demo-layout.vue'));
Vue.component('doc', require("./doc.vue"));
Vue.component('open-file-menu', require("./open-file-menu.vue"));

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
      submenuFirstSet : false,
      menu1enter : true,
      menu2enter : false,
    }
  },
  
  computed : {
    showSubMenu() {
      if (!this.submenuFirstSet) {
        return false;
      }
      if (this.menu2enter) {
        return true;
      }
      return false;
    },
    
    showMainMenu() {
      if (!this.submenuFirstSet) {
        return true;
      }
      if (this.menu1enter) {
        return true;
      }
      return false;
    },
    
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
      this.submenuFirstSet = true;
      this.menu2enter = true;
      this.$options.components['sub-menu-comp'] = mod;
      this.$forceUpdate();
    },
  }
}
</script>

<style>
.el-container {
  height: 100%;
}
.menu1 {
  transition: width 0.7s;
  background-color: #2b2b2b;
  color: #ccc; 
  overflow-x: hidden!important;
}
.menu2 {
  transition: width 0.7s;
  background-color: #796547;
  color: #fff;
  overflow-x: hidden!important;
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


.menu-rev-enter-to {
  width: 50px!important;
}
.menu-rev-leave-to {
  width: 0!important;
}
.menu-rev-enter  {
  width: 0px!important;
}
.menu-rev-leave  {
  width: 50px!important;
}

.menu-enter-to  {
  width: 300px!important;
}
.menu-leave-to  {
  width: 0px!important;
}
.menu-enter  {
  width: 0px!important;
}
.menu-leave  {
  width: 300px!important;
}
</style>