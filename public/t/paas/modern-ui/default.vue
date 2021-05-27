<!-- Create By xBoson System -->

<template>
  <div>
    <el-row :gutter="40" justify="end" type="flex">
      <el-col :span="10" class='url-title'>
        <span>相关开发文档</span>
      </el-col>
      <el-col :span="5" class='url-list'>
        <a href='https://cn.vuejs.org/v2/guide/'>Vue 2</a>
        <a href='https://vuex.vuejs.org/zh/'>Vuex</a>
        <a href='https://router.vuejs.org/zh/guide/'>Vue Router</a>
        <a href='https://github.com/pagekit/vue-resource/tree/develop/docs'>Vue resource</a>
        <a href='../../../web/wiki-api/index.html#ui-docs/xboson-vue.md'>xBoson Vue</a>
        <a href='https://element.eleme.io/#/zh-CN/component/layout'>Element UI</a>
        <a href='https://element.eleme.io/#/zh-CN/component/layout'>Ant Design</a>
        <a href='https://bootstrap-vue.org/docs'>Bootstrap Vue</a>
        <a href='https://echarts.apache.org/examples/zh/index.html'>echarts</a>
        <a href='https://github.com/ecomfe/vue-echarts'>vue-echarts</a>
        <a href='http://datav.jiaminghi.com/'>Vue Big screen</a>
      </el-col>
    </el-row>
    <el-row class='note'>
      <h3>平台 Vue 应用设计原则</h3>
      <li>尽可能将重复部分封装到组件中</li>
      <li>不用 js 脚本访问 dom 元素</li>
      <li>除首页 html 页面, 再没有其他 html 页面文件</li>
      <li>不访问 vue 中的如下变量: 'vm.$el' 'vm.$parent' 'vm.$root' 'vm.$children' 'vm.$refs'</li>
    </el-row>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.url-list a {
  display: block; 
}
.url-title {
  text-align: right; border-right: 1px solid #777;
}
.note {
  color: #999; padding-left: 200px;
}
</style>