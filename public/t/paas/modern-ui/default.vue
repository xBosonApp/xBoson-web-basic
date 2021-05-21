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
        <a href='https://element.eleme.io/#/zh-CN/component/layout'>Element UI</a>
        <a href='https://element.eleme.io/#/zh-CN/component/layout'>Ant Design</a>
      </el-col>
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
</style>