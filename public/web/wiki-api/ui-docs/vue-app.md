# Vue

方便 vue 应用开发的 htm 模板组件


## Vue 应用

一个 vue 应用, 由 vue 基础组件和 ui 组件组成,
通常在目录中创建一个 index.htm:

```html
<!-- index.htm -->
<vue:app>
  <vue:element/>
  <vue:vuex/>
  <div>....</div>
</vue:app>
```

`<vue:app`> 标签是多个子组件的聚合,  
此时浏览器绑定了如下组件:

* Vue
* Vue Router
* Vue Resource
* Element UI
* VueX

在 index.htm 同一目录中创建 app.vue 的文件作为应用引导:

```vue
<template>
  <div>
    <div>{{ msg }} {{count}}</div>
    <!-- el-button 来自 ElementUI 的定义 -->
    <el-button v-on:click="count++">You clicked me {{ count }} times.</el-button> 
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!',
      count: 0,
    }
  }
}
</script>
```

一个最简单 vue 项目构建完成.  

注意: vue 单文件组件中 `<template>` 只能有一个根节点, 超过一个节点则整个组件都不显示.


### 全局 `require(...)`

同步的 require(name) 方法模拟了 nodejs 中的加载器, 有以下规则:

1. 如果以 'cdn/' 开头, 则使用 cjs 同步加载模块, 返回模块的导出
2. 如果 name 存在于全局中, 则直接返回(无法区分大小写)
3. 以 './' 开头的文件以当前引入页面作为根目录, 同步加载模块.
4. 以 '/' 结尾的路径自动添加 `index.js` 文件后缀.
5. 引入文件使用相对路径时, 总是以父模块路径为根路径.
6. 首页文件调用 require 时, 以首页文件路径作为根路径.


## 独立组件

通常完整前端应用程序会组合使用多个组件


### `<vue:vue>`

引入 [Vue 基础库](https://cn.vuejs.org/v2/guide/index.html)

### `<vue:element>`

引入 [Elemenu UI 前端框架库](https://element.eleme.io/#/zh-CN)

### `<vue:resource>`

引入 [资源加载库](https://github.com/pagekit/vue-resource/blob/develop/docs/api.md), 用于远程(ajax)资源加载

### `<vue:router>`

引入 [vue 路由库](https://router.vuejs.org/zh/guide/)

### `<vue:vuex>`

引入 [状态管理模式库](https://vuex.vuejs.org/)