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

该 app.vue 文件是应用程序的根组件, 可以在其中初始化 Vuex, 配置路由, 设置全局样式, 加载更多组件等操作.  
这样一个最简单 vue 项目构建完成.  

注意: vue 单文件组件中 `<template>` 只能有一个根节点, 超过一个节点则整个组件都不显示. 
组件中不支持 Masquerade(.htm) 模板.

> 这里: [打开完整的 UI 前端演示](../../t/paas/modern-ui/index.htm)


# 全局函数/属性

可直接在浏览器上下文中使用; 或者使用 xv 这个前缀.  
如果需要异步导入, 可以使用浏览器自带的 `import(..)` 函数,   
此时在引入 `.vue` 文件时需要带上 es6 参数: `..path/file.vue?es6`.


## `require(name: String [, _use_promise: Boolean, _use_promise_factory: Boolean, _donot_default: Boolean])`

返回 cjs 导出模块, 模块如果是 ES6 导出, 在编译为 ES5 后返回模块的 `.default` 属性,  
同步的 require(name) 方法模拟了 nodejs 中的加载器, 有以下规则:

0. 默认以同步方法加载资源并直接返回模块的导出对象.
1. 如果以 'cdn/' 开头, 则使用 cjs 加载模块, 返回模块的导出
2. 导入通过 defineModule 定义的模块(不支持子目录).
3. 以 './' 开头的文件以当前引入页面作为根目录, 加载模块.
4. 以 '/' 结尾的路径自动添加 `index.js` 文件后缀.
5. 引入文件使用相对路径时, 总是以父模块路径为根路径.
6. 首页文件调用 require 时, 以首页文件路径作为根路径.
7. 绝对路径以 uifs 为根目录为起始目录, 必要时需添加 '/t' '/ui' 这个前缀.
8. 以 'xui://' 为协议时, 自动添加 '/t' '/ui' 前缀, 并且限定范围在该目录下.

如果 `_use_promise` 为 true (或任何布尔为true 的值), 则返回一个 Promise 对象, 并使用异步加载资源.  
如果 `_use_promise_factory` 为 true, 则 `_use_promise` 被忽略, 总是返回一个 Promise 对象工厂函数,
调用该工厂函数, 会返回一个异步 Promise 用来加载资源, 该参数为 Vue 异步加载组件提供支持.  
如果 `_donot_default` 为 true, 则不会自动导出模块中的 `default`.  


```js
// 同步加载js模块
var path = require('path');
path.dirname('/a/b/c.js'); // return string: '/a/b'
// 异步延迟加载 Vue 组件, 只有在组件被使用时才加载.
Vue.component('doc', require("./doc.vue", 1, 1));
```

加载 css 文件时, 该样式表加载后挂接到 document.head 节点上, 返回如下结构:

```js
{
  // style dom 节点实例
  el : HTMLStyleElement, 
  // 如果节点已经卸载, 则重新挂载到页面
  mount : Function(),   
  // 从页面上卸载
  unmount : Function(), 
}
```

加载 html 文件时, 创建的 dom 节点实例不会自动挂载, 需要调用 mount() 指定挂载点, 返回如下结构:

```js
{
  // 文件加载后, 所有 dom 节点默认挂载到该 dom 节点中; 直到这些节点被重新挂载到别处后, el 可能无任何节点.
  el : HTMLElement,       
  // html 文件中的所有顶层 dom 节点数组, 按顺序排列.
  elements : Array, 
  // 将所有 dom 元素挂载到 targetDom 元素内.
  mount : Function(targetDom),
  // 将所有 dom 元素返回到 el 中.
  unmount : Function(),
}
```
 

## `defineModule(module_name: String, module: {exports:{}})`

定义全局模块, 然后可以通过 require 方法导入.

```js
defineModule('vue', { exports: Vue });
//.... 在其他文件处引用:
let vue = require('vue');
```


## `loadCdn(path, _do_not_run)`

从 CDN 中加载并运行全局js库, 通常没有任何返回, 程序库会挂载到 window 全局变量中.  
如果 `_do_not_run` 为 true 则返回文件内容.

```js
loadCdn('element/2.15.1/index.js');
```

> 除特殊情况, 应该使用 `require("cdn/...")` 来加载 CDN 中的资源.


## `popError(title: String, err: Error)`

尽可能在页面上弹出一个错误提示.


## `Promise xAppState()`

该方法可以等待直到 app 引导成功/失败, then/cache 会被回调, 以通知监听器.


## `String getFullPath(path)`

依照文件路径规则返回 path 路径的完整路径.


## `String withFileName(jsCode, filename)`

为动态加载的代码设置文件名, 使代码抛出异常时可以正确的设置堆栈中的文件名.


## `debug`

如果处于调试模式则为 true.


## `url_prefix`

通常为: `http://host[:port]/xboson/face`


## `ctx_prefix`

通常为: `http://host[:port]/xboson`