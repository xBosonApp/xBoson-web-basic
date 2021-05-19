<template>
  <el-container>
    <el-aside class='menu1' width="200px">
      <el-menu  background-color="#2b2b2b"
                text-color="#cccccc"
                active-text-color="#ffd04b"
                @select='openSubMenu'>
        <el-menu-item index='element'>Element UI</el-menu-item>
        <el-menu-item index='bigscreen'>大屏演示</el-menu-item>
        <el-menu-item index='report'>报表演示</el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-aside class='menu2' width="200px" v-show="showSubMenu">
      <sub-menu-comp @change-content='changeContent'></sub-menu-comp>
    </el-aside>
    
    <el-container>
      <el-header class='pagetitle'><h1>xBoson UI DEMO <a>{{currentTitle}}</a></h1></el-header>
      <el-main>
        <content-comp></content-comp>
      </el-main>
      <!--<el-footer>Footer</el-footer>-->
    </el-container>
  </el-container>
</template>

<script>
Vue.component('demo-layout', require('./demo-layout.vue'));

export default {
  props : ['content'],
  data () {
    return {
      showSubMenu : false,
      currentTitle : '',
    }
  },
  
  methods : {
    openSubMenu(id) {
      let path = './'+ id +'/index.vue';
      let mod = require(path);
      this.showSubMenu = true;
      this.$options.components['sub-menu-comp'] = mod;
    },
    
    changeContent(mod, id) {
      this.currentTitle = id[0].toUpperCase() + id.substr(1);
      this.$options.components['content-comp'] = mod;
      this.$forceUpdate();
    }
  }
}
</script>

<style>
.el-container {
  height: 100%;
}
.menu1 {
  background-color: #2b2b2b;
  color: #ccc;
}
.menu2 {
  background-color: #796547;
  color: #fff;
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
</style>