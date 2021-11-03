# xBoson 平台 vue 组件

版权所有: 上海竹呗信息技术有限公司


# Vue2 组件

这些组件在使用时动态加载; 以下为 Vue 组件, 不可在 mas(.htm) 模板中使用.

也可用 require 引入:

```js
require("cdn/xboson-vue/1.0.0/index.js");
```


## `<x-menu2>`

二级菜单组件

```vue 
<x-menu2 @openSubMenu='openSubMenu' :hideAll='hideAllMenu' title='一级菜单标题'>
  <template v-slot:main>
    <el-menu-item index='element'>一级菜单</el-menu-item>
  </template>
  <template v-slot:sub>
    二级菜单
  </template>
</x-menu2>
```

当一级菜单被选中后, @openSubMenu : Function(index) 消息绑定的方法被调用, 第一个参数是菜单项的 index 属性值;
绑定当前组件的数据到 :hideAll 属性上, 当变量改变, 菜单被隐藏;

该组件只负责菜单框架和动画, 菜单如何显示交给调用者处理.


## `<x-api>`

调用平台接口

```vue
<x-api 
  org='a297dfacd7a84eab9656675f61750078'
  app='19cb7c3b79e949b88a9c76396854c2b1'
  mod='prjmgr' 
  api='api' 
  :params='createParams'
  :immediately='false'
  :flag='f1'
  @success='createSuccess'  
  @error='error'/>
```

参数:
* org 机构id
* app 应用id
* mod 模块id
* api 接口id
* params HTTP 参数对象
* immediately 在页面加载后立即请求api, 默认 true
* flag 指向任意变量, 当变量改变时请求 api 

事件:
* success(retData{msg, code, ...}) 接口成功返回 
* error(Error) 接口调用失败


## `<x-agreement>`

显示用户协议

参数:
* visible 是否显示

事件:
* ok 点击 ‘理解并接受’ 按钮后触发


## `<x-login-form>`

登陆表单

事件:
* loginSuccess 登陆成功后发出.


## `<x-login-page>`

默认登陆页面, 与框架配合使用, 在需要登陆时自动显示.


## `<x-ace>`

显示一个代码编辑器

参数:
* v-model 绑定数据 
* language 代码的解析语言, 'javascript' 等, 默认 'text'
* theme 样式

事件:
* editHandle : (editor) 在组件加载后立即发出, 传递一个 ace.editor 实例.


## `<x-null>`

空组件, 什么也不做.


## `<x-selector-api>`

平台 api 选择器

参数:
* org - string 可选, 提供默认 org
* hideOrgSelect - Boolean 可选, 隐藏 org 选择.

事件 
* change : ({org, app, mod, api}) 当选中 api 后被触发, 返回选中的机构/应用/模块/api


## `<x-api-comm>`

通用接口调用

参数:
* url - 地址
* body - post 数据
* params - url 参数
* method - 方法: post/get/head/delete/jsonp/put/patch
* headers - http 请求头域
* timeout - 超时, 默认 5000 (5秒)
* urlencoded - 请求的数据转换为 url 参数格式
* rtype - 返回数据类型: text/json/blob
* v-model - 绑定返回值
* update.sync - 绑定更新方法, 调用该方法则发送请求 返回 promise
* immediately - 在页面渲染后立即请求一次api

事件:
* success(data) 接口成功返回
* error(err) 接口执行失败


## `<x-selector-dict>`

列出机构中的所有字典进行选择, 必要时在该组件外层设置弹出框.

参数:
* showTitle - 显示标题
* org - 必须, 指定机构
* v-model - 绑定变量


## `<x-selector-dict-content>`

下拉列表, 可用作表单, 列出字典中的项目, 进行选择.

参数:
* org - 必须, 指定机构
* dict - 必须, 字典ID
* v-model - 绑定变量


## `<x-selector-org>`

下拉列表, 可用作表单, 列出用户可用的机构列表, 进行选择

参数:
* v-model - 绑定变量
* openid - 可选, 指定用户


## `<x-url-param>`
 
将 URL 请求参数绑定到变量

参数:
* v-model - 绑定变量


# Vue2 插件 

绑定到 Vue 实例上的方法 / 属性


## Promise $xapi(url, params)

调用平台接口, url 需自行补全路径, 对返回按平台约定进行格式化.
在必要时发出登陆请求.


## $globalBus

全局消息对象, 除非特别约定, 组件不应该依赖任何全局事件来传递参数.
滥用全局事件会导致组件不可复用.


# Vue2 指令

## `v-components-loader`

给子组件设置组件加载器

```vue
<some-tag v-components-loader="{'tagName': require('./path.vue')}" />
```


# Vue2 组件库加载器

用 require 函数引入加载器脚本, 这些加载器会加载所有依赖文件, 并挂载到 Vue 中.


## xBoson 1.0.0

```js
require("cdn/xboson-vue/1.0.0/index.js")
```


## Antd 1.7.5

[打开文档](https://www.antdv.com/docs/vue/introduce-cn/)

```js
require("cdn/xboson-vue/1.0.0/loader/antd.js")
```


## Bootstrap 2.21.2

[打开 GIT](https://github.com/bootstrap-vue/bootstrap-vue)

```js
require("cdn/xboson-vue/1.0.0/loader/bootstrap.js")
```


## eCharts 5.1.1

[打开文档](https://echarts.apache.org/zh/tutorial.html)

```js
require("cdn/xboson-vue/1.0.0/loader/echarts.js")
```

## Element UI 2.15.1

[打开文档](https://element.eleme.cn/#/zh-CN/component/installation)

```js
require("cdn/xboson-vue/1.0.0/loader/elementui.js")
```


## Animate.CSS 4.1.1 

[打开文档](https://animate.style/)

```js
require("cdn/animate.css/4.1.1/animate.min.css")
```


## Vux 2.9.6

[打开文档](https://doc.vux.li/zh-CN/)

组件名加 `vux-` 前缀

```js
require("cdn/xboson-vue/1.0.0/loader/vux.js")
```


## Vuetify 2.5.0

[打开文档](https://vuetifyjs.com/zh-Hans/getting-started/installation/)

```js
require("cdn/xboson-vue/1.0.0/loader/vuetify.js")
```


## Vue Smooth DnD 0.8.1

[打开文档](https://github.com/kutlugsahin/vue-smooth-dnd)

```js
require("cdn/xboson-vue/1.0.0/loader/smooth-dnd.js")
```


# Vue3 组件库加载器

> 未支持