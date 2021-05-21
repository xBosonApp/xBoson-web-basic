# Vue

xBoson 平台 Vue 应用开发指南.

一个 Vue 应用除了一个 index.htm 是应用引导文件外, 不应该再有其他的页面文件,  
Vue 应用全部由且只由 vue 组件构成.


## Vue 应用

一个 vue 应用, 由 vue(ver 2.x) 基础组件和 ui 组件组成,
通常在目录中创建一个 index.htm:

```html
<!-- index.htm -->
<vue:app>
  <vue:element/>
  .... 插入一些 css 代码, 或引入非 vue js 库 等 ....
</vue:app>
```

`<vue:app`> 标签是多个子组件的聚合, 其中 `<vue:element/>` 可以替换为其他 ui 库, 这是可选的;
你也可是加载其他依赖的 vue 库组件.

此时浏览器绑定了如下组件:

* Vue - 固定
* Vue Router - 固定
* Vue Resource - 固定
* VueX - 固定
* Element UI - 可选

在 index.htm 同一目录中创建 app.vue 的文件:

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

该 app.vue 文件是应用程序的根组件, 可以在其中初始化 Vuex, 设置全局样式, 加载更多组件等操作.  
这样一个最简单 vue 项目构建完成.  

注意: vue 单文件组件中 `<template>` 只能有一个根节点, 超过一个节点则整个组件都不显示. 
组件中不支持 Masquerade(.htm) 模板.

> 这里: [打开完整的 UI 前端演示](../../t/paas/modern-ui/index.htm)


### 全局函数/属性

可直接在浏览器上下文中使用.
如果需要异步导入, 可以使用浏览器自带的 `import(..)` 函数,   
此时在引入 `.vue` 文件时需要带上 es6 参数: `..path/file.vue?es6`.


#### `require(name: String [, _use_promise: Boolean, _use_promise_factory: Boolean])`

返回 cjs 导出模块, 模块如果是 ES6 导出, 在编译为 ES5 后返回模块的 `.default` 属性,  
同步的 require(name) 方法模拟了 nodejs 中的加载器, 有以下规则:

0. 默认以同步方法加载资源并直接返回模块的导出对象.
1. 如果以 'cdn/' 开头, 则使用 cjs 加载模块, 返回模块的导出
2. 导入通过 defintModule 定义的模块(不支持子目录).
3. 以 './' 开头的文件以当前引入页面作为根目录, 加载模块.
4. 以 '/' 结尾的路径自动添加 `index.js` 文件后缀.
5. 引入文件使用相对路径时, 总是以父模块路径为根路径.
6. 首页文件调用 require 时, 以首页文件路径作为根路径.

如果 `_use_promise` 为 true (或任何布尔为true 的值), 则返回一个 Promise 对象, 并使用异步加载资源.  
如果 `_use_promise_factory` 为 true, 则 `_use_promise` 被忽略, 总是返回一个 Promise 对象工厂函数,
调用该工厂函数, 会返回一个异步 Promise 用来加载资源, 该参数为 Vue 异步加载组件提供支持


```js
// 同步加载js模块
var path = require('path');
path.dirname('/a/b/c.js'); // return string: '/a/b'
// 异步延迟加载 Vue 组件, 只有在组件被使用时才加载.
Vue.component('doc', require("./doc.vue", 1, 1));
```
 

#### `defintModule(module_name: String, module: {exports:{}})`

定义全局模块, 通过 require 方法导入.

```js
defintModule('vue', { exports: Vue });
```


#### `loadCdn(path)`

从 CDN 中加载全局js库, 通常没有任何返回, 程序库会挂载到 window 全局变量中.

```js
loadCdn('element/2.15.1/index.js');
```


#### `popError(info: String, err: Error)`

尽可能在页面上弹出一个错误提示.


#### `debug`

如果处于调试模式则为 true.


## 独立组件

通常完整前端应用程序会组合使用多个组件, 组件必须在应用引导页 `index.htm` 中引入.


### `<vue:vue>`

引入 [Vue 基础库](https://cn.vuejs.org/v2/guide/index.html)

### `<vue:resource>`

引入 [资源加载库](https://github.com/pagekit/vue-resource/blob/develop/docs/api.md), 用于远程(ajax)资源加载

### `<vue:router>`

引入 [vue 路由库](https://router.vuejs.org/zh/guide/)

### `<vue:vuex>`

引入 [状态管理模式库](https://vuex.vuejs.org/)

### `<vue:element>`

引入 [Elemenu UI 前端框架库](https://element.eleme.io/#/zh-CN)

### `<vue:antd>`

引入 [Ant Design 的 Vue 实现，开发和服务于企业级后台产品。](https://www.antdv.com/docs/vue/introduce-cn/)